import argparse
import cv2
import numpy as np
import socket
import json
from random import randint
from inference import Network
import paho.mqtt.client as mqtt
import json
import sys

INPUT_STREAM = "test_video.mp4"
CPU_EXTENSION = "/opt/intel/openvino/deployment_tools/inference_engine/lib/intel64/libcpu_extension_sse4.so"
EMOTION_MODEL = "./models/emotions-recognition-retail-0003.xml"
FACE_MODEL = "./models/face-detection-retail-0004.xml"

EMOTION_LIST = ['neutral', 'happy', 'sad', 'surprise', 'anger']

# MQTT server environment variables
HOSTNAME = socket.gethostname()
IPADDRESS = socket.gethostbyname(HOSTNAME)
MQTT_HOST = IPADDRESS
MQTT_PORT = 3001
MQTT_KEEPALIVE_INTERVAL = 60

def get_args():
    '''
    Gets the arguments from the command line.
    '''
    parser = argparse.ArgumentParser("Run inference on an input video")
    # -- Create the descriptions for the commands
    i_desc = "The location of the input file"
    d_desc = "The device name, if not 'CPU'"

    # -- Create the arguments
    parser.add_argument("-i", help=i_desc, default=INPUT_STREAM)
    parser.add_argument("-d", help=d_desc, default='CPU')
    args = parser.parse_args()

    return args

def infer_on_video(args, models):
    # Connect to the MQTT server
    client = mqtt.Client()
    client.connect(MQTT_HOST, port=MQTT_PORT, keepalive=MQTT_KEEPALIVE_INTERVAL)

    # Initialize the Inference Engine for two models
    face_net = Network()
    emotion_net = Network()

    # Load the network model into the IE
    face_net.load_model(models["face"], args.d, CPU_EXTENSION)
    emotion_net.load_model(models["emotion"], args.d, CPU_EXTENSION)
    
    face_input_shape = face_net.get_input_shape()
    emotion_input_shape = emotion_net.get_input_shape()

    # Get and open video capture
    cap = cv2.VideoCapture(args.i)
    cap.open(args.i)

    # Grab the shape of the input 
    width = int(cap.get(3))
    height = int(cap.get(4))

    # Process frames until the video ends, or process is exited
    while cap.isOpened():
        # Read the next frame
        flag, frame = cap.read()
        if not flag:
            break
        key_pressed = cv2.waitKey(60)

        # Pre-process the frame for face detection
        p_face_frame = cv2.resize(frame, (face_input_shape[3], face_input_shape[2]))
        p_face_frame = p_face_frame.transpose((2,0,1))
        p_face_frame = p_face_frame.reshape(1, *p_face_frame.shape)

        # Perform face detection inference on the frame
        face_net.async_inference(p_face_frame)

        # Get the output of inference
        if face_net.wait() == 0:
            face_result = face_net.extract_output()
            for box in face_result[0][0]:
                conf = box[2]
                if conf >= 0.5:
                    xmin = int(box[3] * width)
                    ymin = int(box[4] * height)
                    xmax = int(box[5] * width)
                    ymax = int(box[6] * height)
                    
                    # Draw the detected bounding boxes
                    out_frame = cv2.rectangle(frame, (xmin, ymin), (xmax, ymax), (255, 255, 255), 5)
                    
                    # Get face for emotion model
                    p_emotion_frame = frame[ ymin:ymax, xmin:xmax ]
                    
                    # Pre-process the frame for emotion detection
                    p_emotion_frame = cv2.resize(p_emotion_frame, (emotion_input_shape[3], emotion_input_shape[2]))
                    p_emotion_frame = p_emotion_frame.transpose((2,0,1))
                    p_emotion_frame = p_emotion_frame.reshape(1, *p_emotion_frame.shape)
                    
                    # Perform face detection inference on the frame
                    emotion_net.async_inference(p_emotion_frame)
                    
                    # Get the output of inference
                    if emotion_net.wait() == 0:
                        emotion_result = emotion_net.extract_output()
                        emotion_result = np.squeeze(emotion_result)
                        
                        # Add emotion text on frame
                        index_max = np.argmax(emotion_result)
                        
                        # Send the currect emotion to the MQTT server
                        client.publish("emotion", json.dumps({"emotion": EMOTION_LIST[index_max]}))

        # Send frame to the ffmpeg server
        sys.stdout.buffer.write(out_frame)
        sys.stdout.flush()

        # Break if escape key pressed
        if key_pressed == 27:
            break

    # Release the capture and destroy any OpenCV windows
    cap.release()
    cv2.destroyAllWindows()
    # Disconnect from MQTT
    client.disconnect()

def main():
    args = get_args()
    models = {
        "emotion": EMOTION_MODEL,
        "face": FACE_MODEL
    }
    infer_on_video(args, models)


if __name__ == "__main__":
    main()

**This Real Time Emotion Recognition project provides an brand new feedback interface to advance your presentation**

# Real Time Emotion Recognition
When we give a presentation or a speech, having some feedbacks are essential to improving your presentation.

Looking directly their face expressions is one of the best way to collect robust feedback. Are they smile, angery, or nuetural?

<img src="/doc/demo.gif">

# Running the app

### Prerequisites

- OpenVINO Toolkit
- Python 3
- ffmpeg
- npm or yarn
- Node.js

First, get the MQTT broker and UI installed.

`cd webservice/server`  
`npm install`  
When complete, `cd ../ui`  
And again, `npm install`

You will need four separate terminal windows open in order to run the app on your local computer.

1. Get the MQTT broker installed and running.  
`cd webservice/server/node-server`  
`node ./server.js`  
You should see a message that Mosca server started.

1. Get the UI Node Server running  
`cd webservice/ui`  
`npm run dev`  
After a few seconds, you should see `webpack: Compiled successfully`.

1. Start the ffserver  
`sudo ffserver -f ./ffmpeg/server.conf`

1. Start the actual application.  
First, you need to source the environment for OpenVINO in your terminal  
`source /opt/intel/openvino/bin/setupvars.sh -pyver 3.5`  
To run the app, I'll give you two items to pipe in with ffmpeg here, with the rest up to you:  
`python app.py | ffmpeg -v warning -f rawvideo -pixel_format bgr24 -video_size 1280x720 -framerate 24 -i - http://0.0.0.0:3004/fac.ffm`

The application UI is up and running on your localhost on port 3000.

# The Models
The emotion recognition model is [emotion-recognition-retail-0003](https://docs.openvinotoolkit.org/2019_R1/_emotions_recognition_retail_0003_description_emotions_recognition_retail_0003.html) from Open Model Zoo.  
Fully convolutional network for recognition of five emotions ('neutral', 'happy', 'sad', 'surprise', 'anger').

For the face detection model, [face-detection-retail-0004](https://docs.openvinotoolkit.org/2019_R1/_face_detection_retail_0004_description_face_detection_retail_0004.html) from Open Model Zoo as well.  
Face detector based on SqueezeNet light (half-channels) as a backbone with a single SSD

# Contributing
Pull requests are welcome!

# Credit
Computer vision powered by [OpenVINO Toolkit](https://software.intel.com/en-us/openvino-toolkit).

[Intel® Edge AI Scholarship Program](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=2ahUKEwjqjrX5jOrnAhVaQd4KHcg1DyMQFjAAegQIAhAB&url=https%3A%2F%2Fwww.udacity.com%2Fscholarships%2Fintel-edge-ai-scholarship&usg=AOvVaw0gVyhoXxICgbHEYHgz0SsB)

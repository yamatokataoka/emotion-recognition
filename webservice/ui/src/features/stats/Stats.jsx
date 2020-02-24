import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import DataBox from "components/data-box/DataBox";
import FontAwesome from "react-fontawesome";
import mq from "../../MqttClient";
import { MQTT, SETTINGS } from "../../constants/constants";
import "./Stats.css";

class Stats extends React.Component {
  constructor( props ) {
    super( props );

    this.handleMqtt = this.handleMqtt.bind( this );
    this.calculateEmotion = this.calculateEmotion.bind( this );
    this.state = {
      currentEmotion: "Emotion",
      currentFrameData: [],
      currentFrameLabels: [],
    };
  }

  componentDidMount() {
    // register handler with mqtt client
    mq.addHandler( "class", this.handleMqtt );
  }

  componentWillUnmount() {
    mq.removeHandler( "class" );
  }

  handleMqtt( topic, payload ) {
    switch ( topic ) {
      case MQTT.TOPICS.EMOTION:
        this.calculateEmotion( payload );
        break;
      default:
        break;
    }
  }

  calculateEmotion( input ) {
    let newLabel = this.state.currentFrameLabels;
    let newFrameData = this.state.currentFrameData;
    newLabel.push( input.emotion );
    if ( input.emotion != undefined ) {
      newFrameData.push( input.emotion );
    }
    if ( newFrameData.length > SETTINGS.MAX_POINTS ) {
      const sliceFrameData = newFrameData.slice( SETTINGS.SLICE_LENGTH );
      const sliceFrameLabels = newLabel.slice( SETTINGS.SLICE_LENGTH );
      newFrameData = sliceFrameData;
      newLabel = sliceFrameLabels;
    }
    this.setState( { 
        currentEmotion: input.emotion,
        currentFrameLabels: newLabel,
        currentFrameData: newFrameData 
    } );
  }

  render() {
    console.log(`[INFO] this.state.currentEmotion: ${ this.state.currentEmotion }`);
    return (
      <div className={ `stats ${ this.props.statsOn ? "active" : "" }` }>
        { /* Current emotion */ }
        <DataBox title="Emotion" data={ this.state.currentEmotion } color="blue" />
      </div>
    );
  }
}

Stats.propTypes = {
  statsOn: PropTypes.bool.isRequired,
};

Stats.defaultProps = {
};

export default Stats;

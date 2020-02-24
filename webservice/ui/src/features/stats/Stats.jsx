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
      currentEmotionData: [],
      currentEmotionLabels: [],
      currentNeutralCount: 0,
      currentHappyCount: 0,
      currentSadCount: 0,
      currentSurpriseCount: 0,
      currentAngerCount: 0,
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
      case MQTT.TOPICS.EMOTIONS:
        this.calculateEmotions( payload );
        break;
      default:
        break;
    }
  }

  calculateEmotion( input ) {
    let newEmotionLabel = this.state.currentEmotionLabels;
    let newEmotionData = this.state.currentEmotionData;
    newEmotionLabel.push( input.emotion );
    if ( input.emotion != undefined ) {
      newEmotionData.push( input.emotion );
    }
    if ( newEmotionData.length > SETTINGS.MAX_POINTS ) {
      const sliceEmotionData = newEmotionData.slice( SETTINGS.SLICE_LENGTH );
      const sliceEmotionLabels = newEmotionLabel.slice( SETTINGS.SLICE_LENGTH );
      newEmotionData = sliceEmotionData;
      newEmotionLabel = sliceEmotionLabels;
    }
    this.setState( { 
      currentEmotion: input.emotion,
      currentEmotionLabels: newEmotionLabel,
      currentEmotionData: newEmotionData 
    } );
  }

  calculateEmotions( input ) {
    this.setState( { 
      currentNeutralCount: input.emotions["neutral"],
      currentHappyCount: input.emotions["happy"],
      currentSadCount: input.emotions["sad"],
      currentSurpriseCount: input.emotions["surprise"],
      currentAngerCount: input.emotions["anger"],
    } );
  }

  render() {
    console.log(`[INFO] this.state.currentEmotion: ${ this.state.currentEmotion }`);
    return (
      <div className={ `stats ${ this.props.statsOn ? "active" : "" }` }>
        { /* Current emotion */ }
        <DataBox title="Highlight" data={ this.state.currentEmotion } />
        { /* Current neutral count */ }
        <DataBox title="Neutral" data={ this.state.currentNeutralCount } />
        { /* Current happy count */ }
        <DataBox title="Happy" data={ this.state.currentHappyCount } />
        { /* Current sad count */ }
        <DataBox title="sad" data={ this.state.currentSadCount } />
        { /* Current surprise count */ }
        <DataBox title="surprise" data={ this.state.currentSurpriseCount } />
        { /* Current anger count */ }
        <DataBox title="anger" data={ this.state.currentAngerCount } />
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

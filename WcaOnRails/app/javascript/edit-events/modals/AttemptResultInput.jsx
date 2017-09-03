import React from 'react'

import events from 'wca/events.js.erb'
import {
  MINUTE_IN_CS,
  SECOND_IN_CS,
  mbPointsToAttemptResult,
  attemptResultToMbPoints,
} from './utils'

class CentisecondsInput extends React.Component {
  get value() {
    let minutes = parseInt(this.minutesInput.value) || 0;
    let seconds = parseInt(this.secondsInput.value) || 0;
    let centiseconds = parseInt(this.centisecondsInput.value) || 0;
    return minutes*60*100 + seconds*100 + centiseconds;
  }

  render() {
    let { id, autoFocus, centiseconds, onChange } = this.props;

    let minutes = Math.floor(centiseconds / MINUTE_IN_CS);
    centiseconds %= MINUTE_IN_CS;

    let seconds = Math.floor(centiseconds / SECOND_IN_CS);
    centiseconds %= SECOND_IN_CS;

    return (
      <div>
        <input type="number"
               id={id}
               name="minutes"
               className="form-control"
               autoFocus={autoFocus}
               value={minutes}
               min={0} max={60}
               ref={c => this.minutesInput = c}
               onChange={onChange} />
        minutes

        <input type="number"
               name="seconds"
               className="form-control"
               value={seconds}
               min={0} max={59}
               ref={c => this.secondsInput = c}
               onChange={onChange} />
        seconds

        <input type="number"
               name="centiseconds"
               className="form-control"
               value={centiseconds}
               min={0} max={99}
               ref={c => this.centisecondsInput = c}
               onChange={onChange} />
        centiseconds
      </div>
    );
  }
}

export default class extends React.Component {
  onChange = () => {
    this.props.onChange();
  }

  get value() {
    let event = events.byId[this.props.eventId];

    if(event.timed_event) {
      return this.centisecondsInput.value;
    } else if(event.fewest_moves) {
      return parseInt(this.movesInput.value);
    } else if(event.multiple_blindfolded) {
      return mbPointsToAttemptResult(parseInt(this.mbldPointsInput.value));
    } else {
      throw new Error(`Unrecognized event type: ${event.id}`);
    }
  }

  render() {
    let { id, autoFocus } = this.props;
    let event = events.byId[this.props.eventId];

    if(event.timed_event) {
      return <CentisecondsInput id={id}
                                autoFocus={autoFocus}
                                centiseconds={this.props.value}
                                onChange={this.onChange}
                                ref={c => this.centisecondsInput = c}
      />;
    } else if(event.fewest_moves) {
      return (
        <div>
          <input type="number"
                 id={id}
                 className="form-control"
                 autoFocus={autoFocus}
                 value={this.props.value}
                 ref={c => this.movesInput = c}
                 onChange={this.onChange} />
          moves
        </div>
      );
    } else if(event.multiple_blindfolded) {
      return (
        <div>
          <input type="number"
                 id={id}
                 className="form-control"
                 autoFocus={autoFocus}
                 value={attemptResultToMbPoints(this.props.value)}
                 ref={c => this.mbldPointsInput = c}
                 onChange={this.onChange} />
          points
        </div>
      );
    } else {
      throw new Error(`Unrecognized event type: ${event.id}`);
    }
  }
}

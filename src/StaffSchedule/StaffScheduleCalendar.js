/* eslint-disable no-unused-vars */
/* eslint react/prop-types: 0 */
import React from 'react';
import Calendar from '@toast-ui/react-calendar';
import 'tui-calendar/dist/tui-calendar.css';

import moment from 'moment';

// If you use the default popups, use this.
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';

import { Button } from 'react-bootstrap';

class StaffScheduleCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      day: new Date(),
      isWeek: false,
    };
    this.calendarRef = React.createRef();
  }

  // ---------- Instance method ---------- //

  // Button to move next month
  handleClickNextButton = () => {
    const calendarInstance = this.calendarRef.current.getInstance();

    if (this.props.view == 'day') {
      this.setState({ day: moment(this.state.day).add(1, 'days') });
    }
    calendarInstance.next();
  };

  // Button to move next month
  handleClickPrevButton = () => {
    const calendarInstance = this.calendarRef.current.getInstance();
    if (this.props.view == 'day') {
      this.setState({ day: moment(this.state.day).subtract(1, 'days') });
    }
    calendarInstance.prev();
  };

  weekChangeButton = () => {
    const calendarInstance = this.calendarRef.current.getInstance();

    calendarInstance.changeView('week', true);
  };

  // ---------- Event ---------- //

  handleClickDayname = (ev) => {
    console.group('onClickDayname');
    console.groupEnd();
  };

  beforeCreateSchedule = (ev) => {
    console.group('onbeforeCreateSchedule');
    console.groupEnd();
  };

  componentDidMount() {
    if (this.props.view == 'week') {
      this.setState({ isWeek: true });
    }
  }

  render() {
    const selectedView = this.props.view;
    return (
      <>
        <Button variant="outline-*" onClick={this.handleClickPrevButton}>
          {' '}
          &laquo;{' '}
        </Button>
        {!this.state.isWeek && <span>{moment(this.state.day).format('ll')}</span>}
        {this.state.isWeek && <span>Week</span>}
        <Button variant="outline-*" onClick={this.handleClickNextButton}>
          {' '}
          &raquo;{' '}
        </Button>
        <Calendar
          ref={this.calendarRef}
          onClickDayname={this.handleClickDayname}
          onbeforeCreateSchedule={this.beforeCreateSchedule}
          height="900px"
          calendars={[]}
          disableDblClick={true}
          disableClick={false}
          isReadOnly={false}
          schedules={this.props.schedule}
          scheduleView
          taskView
          template={{
            milestone(schedule) {
              return `<span style="color:#fff;background-color: ${schedule.bgColor};">${schedule.title}</span>`;
            },
            milestoneTitle() {
              return 'Milestone';
            },
            allday(schedule) {
              return `${schedule.title}<i class="fa fa-refresh"></i>`;
            },
            alldayTitle() {
              return 'All Day';
            },
          }}
          theme=""
          timezones={[
            {
              timezoneName: 'America/New_York',
              displayLabel: 'GMT-05:00',
              tooltip: 'New York',
            },
          ]}
          useDetailPopup
          view={selectedView}
          month={{
            daynames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          }}
        />
      </>
    );
  }
}

export default StaffScheduleCalendar;

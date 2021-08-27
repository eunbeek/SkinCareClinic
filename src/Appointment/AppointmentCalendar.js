/* eslint-disable no-unused-vars */
/* eslint react/prop-types: 0 */
import React from 'react';
import Calendar from '@toast-ui/react-calendar';
import 'tui-calendar/dist/tui-calendar.css';

// If you use the default popups, use this.
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';

import { Button } from 'react-bootstrap';

class AppointmentCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appointment: [],
      schedule: [],
      customer: [],
      month: 0,
      monthText: String,
      _id: localStorage.getItem('_id'),
    };
    this.calendarRef = React.createRef();
  }
  getAppointment(custId) {
    fetch(`${process.env.REACT_APP_API_URL}/appointment?customer=${custId}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          appointment: data,
        });
        this.formatCalendar(this.state.appointment);
      });
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_API_URL}/customer?account=${this.state._id}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          customer: data,
        });
        this.getAppointment(this.state.customer._id);
      });
  }

  formatCalendar = (appointments) => {
    if (appointments == null) {
      console.log('Error');
    } else {
      appointments.forEach((appointment) => {
        var pureDate = appointment.schedule.date.date.split('/');
        var pureTime = appointment.schedule.time.time.split('-');
        var pureStart = pureTime[0].split(':');
        var pureEnd = pureTime[1].split(':');

        pureDate[0] = String(Number(pureDate[0]) - 1);

        var startTime = new Date(pureDate[2], pureDate[0], pureDate[1], pureStart[0], pureStart[1]);
        var endTime = new Date(pureDate[2], pureDate[0], pureDate[1], pureEnd[0], pureEnd[1]);
        var appnt_id = appointment._id;
        var appnt_title = appointment.service.name;

        var tempAppnmt = {
          id: appnt_id,
          caalendarId: 1,
          title: appnt_title,
          category: 'time',
          dueDateClass: '',
          start: startTime.toISOString(),
          end: endTime.toISOString(),
          isReadOnly: true,
        };

        this.setState({
          schedule: this.state.schedule.concat(tempAppnmt),
          month: Number(pureDate[0]) + 1,
        });

        this.handleMonthText(this.state.month);
      });
    }
  };

  handleMonthText = (month) => {
    var tempText = '';

    var editMonth = month >= 0 ? month % 12 : 12 - (Math.abs(month) % 12);
    switch (editMonth) {
      case 0:
        tempText = 'December';
        break;
      case 1:
        tempText = 'January';
        break;
      case 2:
        tempText = 'February';
        break;
      case 3:
        tempText = 'March';
        break;
      case 4:
        tempText = 'April';
        break;
      case 5:
        tempText = 'May';
        break;
      case 6:
        tempText = 'June';
        break;
      case 7:
        tempText = 'July';
        break;
      case 8:
        tempText = 'August';
        break;
      case 9:
        tempText = 'September';
        break;
      case 10:
        tempText = 'October';
        break;
      case 11:
        tempText = 'November';
        break;
      case 12:
        tempText = 'December';
        break;
    }
    this.setState({
      monthText: tempText,
    });
  };
  // ---------- Instance method ---------- //

  // Button to move next month
  handleClickNextButton = () => {
    const calendarInstance = this.calendarRef.current.getInstance();
    var tempNum = this.state.month + 1;
    this.setState({
      month: tempNum,
    });
    this.handleMonthText(tempNum);
    calendarInstance.next();
  };

  // Button to move next month
  handleClickPrevButton = () => {
    const calendarInstance = this.calendarRef.current.getInstance();
    var tempNum = this.state.month - 1;
    this.setState({
      month: tempNum,
    });
    this.handleMonthText(tempNum);
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

  render() {
    const selectedView = this.props.view; // default view
    return (
      <>
        <Button variant="outline-*" onClick={this.handleClickPrevButton}>
          {' '}
          &laquo;{' '}
        </Button>
        <span>{this.state.monthText}</span>
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
          schedules={this.state.schedule}
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
          view={selectedView} // You can also set the `defaultView` option.
          month={{
            daynames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          }}
        />
      </>
    );
  }
}

export default AppointmentCalendar;

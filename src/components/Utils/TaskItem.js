import './TaskItem.less';
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import { isZeroDateTime } from '../../utils/time';
import { TASK_TYPES, TASK_STATE } from '../../constants/Constants';
import moment from 'moment';

const TASK_ID_REGEX = /##(\d+)##/gi;

const TaskItem = ({ playbookTask }) => {
  const isDateSet = !isZeroDateTime(playbookTask.dueDate);
  const overdue = isDateSet && moment().diff(moment(playbookTask.dueDate)) < 0;
  const isError = playbookTask.state === TASK_STATE.Error;
  const isWaiting = playbookTask.state === TASK_STATE.Waiting;

  const nextTaskClass = classNames('ui', 'form', {
    'overdue-header': overdue && !isError && !isWaiting,
    'error-header': isError,
    'waiting-header': isWaiting
  });

  const taskHeaderClasses = classNames('fifteen wide field', {
    'overdue-text': overdue && !isError,
    'error-text': isError
  });

  let id = playbookTask.id;
  const matches = cloneDeep(TASK_ID_REGEX).exec(id);
  if (matches && matches.length > 1) {
    id = matches[1];
  }
  return (
    <div className="next-task" key={id} id={id}>
      <div className={nextTaskClass}>
        <div className="task-content inline fields">
          <div className={taskHeaderClasses}>
            <span className="task-id">{'#' + id}</span>
            <span className="task-name ellipsis" title={playbookTask.taskName}>{playbookTask.taskName}</span>
          </div>
          <div className="task-right-side">
            {playbookTask.type === TASK_TYPES.ConditionTask &&
              <span className="task-circular-icon">
                <i className="ui icon mini circular fork dark" />
              </span>
            }
          </div>
        </div>
        <div className="task-data three fields" id={'playbook_' + playbookTask.id}>
          {playbookTask.assignee}
          <div className="separator" />
            {isDateSet &&
            [
              <span key="date" style={{ marginRight: '5px' }}>{moment(playbookTask.dueDate).format('MM/DD/YYYY')}</span>,
              <span key="time">{moment(playbookTask.dueDate).format('HH:mm')}</span>
            ]
          }
        </div>
      </div>
    </div>
  );
};

TaskItem.propTypes = {
  playbookTask: PropTypes.object,
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  classes: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.string,
  titleStyle: PropTypes.object
};

export default TaskItem;

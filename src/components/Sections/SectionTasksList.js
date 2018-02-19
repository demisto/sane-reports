import React, { PropTypes } from 'react';
import TaskItem from '../Utils/TaskItem';

function buildTasks(tasks) {
  return (
    <div className="ui list">
      {
        tasks
          .map((task) => {
            const invId = task.investigationId;
            const taskId = task.taskId;
            return (
              <div key={invId + taskId} className="item">
                <div className="content">
                  <TaskItem playbookTask={task} />
                </div>
              </div>
            );
          })
      }
    </div>
  );
}

const SectionTasksList = ({ tasks, title, titleStyle }) => {
  const isEmpty = !tasks || tasks.length === 0;
  const tasksEl = buildTasks(tasks);
  return (
    <div className="tasks-list">
      {title && <div className="section-title" style={titleStyle}>{title}</div>}
      {!isEmpty && tasksEl}
    </div>
  );
};

SectionTasksList.propTypes = {
  tasks: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  classes: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.string,
  titleStyle: PropTypes.object
};

export default SectionTasksList;

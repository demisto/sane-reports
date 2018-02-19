import React, { PropTypes } from 'react';
import moment from 'moment';

function buildMessages(messages) {
  return (
    <div className="ui very relaxed selection list messages-list">
      {
        messages.map((m) => {
          if (!m || !m.metadata) {
            return null;
          }
          const metadata = m.metadata;
          const user = metadata.username;
          const time = moment(m.received).calendar();
          const investigation = metadata.invName;
          const { entry } = metadata;
          const investigationId = m.incidentID;
          const investigationLongName = '#' + investigationId + ' ' + investigation;
          let content = m.body;
          if (entry) {
            content = metadata.parentContent;
          }
          return [
            <a
              key={m.id}
              className="item message"
              title={investigationLongName}
            >
              <div className="ui padded grid">
                <div className="fourteen wide column mention-text">
                  <div className="ui padded two column grid">
                    <div className="column" style={{ paddingLeft: 0 }}>
                      <span className="user" style={{ marginRight: '5px' }}>{user}</span>
                      <span className="time">{time}</span>
                    </div>
                    <div className="right aligned column">
                      {investigationId &&
                        <div
                          title={investigationLongName}
                          className="war-room-link ellipsis"
                        >
                          {investigationLongName}
                        </div>
                      }
                    </div>
                  </div>
                  <div className="message-content">
                    {content}
                  </div>
                </div>
              </div>
            </a>
          ];
        })
      }
    </div>
  );
}

const SectionMessageList = ({ messages, classes, style, title, titleStyle }) => {
  let messagesEl = (
    <div className="empty-message">
    </div>
  );
  if (messages.length > 0) {
    messagesEl = buildMessages(messages);
  }
  return (
    <div className={messages + ' ' + classes} style={style}>
      {title && <div className="section-title" style={titleStyle}>{title}</div>}
      {messagesEl}
    </div>
  );
};

SectionMessageList.propTypes = {
  messages: PropTypes.array,
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

export default SectionMessageList;

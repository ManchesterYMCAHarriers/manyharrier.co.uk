import React from 'react'
import PropTypes from 'prop-types'
import {
  FaBeer,
  FaMapMarkerAlt,
  FaMedal,
  FaMountain,
  FaRunning,
  FaTrophy,
} from 'react-icons/fa'

class EventTags extends React.Component {
  render() {
    const { key, tags } = this.props

    if (tags.length === 0) {
      return null
    }

    const icons = {
      championship: <FaMedal />,
      competition: <FaTrophy />,
      eventType: <FaRunning />,
      terrain: <FaMountain />,
      venue: <FaMapMarkerAlt />,
    }

    const classNames = {
      championship: 'is-warning',
      competition: 'is-info',
      eventType: 'is-primary',
      terrain: 'is-dark',
      venue: 'is-success',
    }

    const data = tags.map(tag => {
      let icon = tag.value === 'Social' ? <FaBeer /> : icons[tag.key]
      let className = tag.value === 'Social' ? 'is-danger' : classNames[tag.key]
      return {
        className: className,
        icon: icon,
        value: tag.value,
      }
    })

    return (
      <div className="field is-grouped is-grouped-multiline">
        {data.map((tag, i) => (
          <div className="control" key={key + '-tag-' + i}>
            <div className="tags has-addons">
              <span className="tag">
                <span className="icon is-small">{tag.icon}</span>
              </span>
              <span className={'tag ' + tag.className}>{tag.value}</span>
            </div>
          </div>
        ))}
      </div>
    )
  }
}

EventTags.propTypes = {
  reactKey: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
}

export default EventTags

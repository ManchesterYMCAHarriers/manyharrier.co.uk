import React from 'react'
import PropTypes from 'prop-types'
import {
  FaBeer,
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
    }

    const classNames = {
      championship: 'border-yellow-500',
      competition: 'border-blue-500',
      eventType: 'border-orange-500',
      terrain: 'border-green-500',
    }

    const data = tags.map(tag => {
      let icon = tag.value === 'Social' ? <FaBeer /> : icons[tag.key]
      let className =
        tag.value === 'Social' ? 'border-pink-300' : classNames[tag.key]
      return {
        className: className,
        icon: icon,
        value: tag.value,
      }
    })

    return (
      <div className="flex flex-wrap">
        {data.map(({ className, icon, value }, i) => (
          <div
            className={
              'flex flex-wrap items-center mt-2 mr-2 leading-relaxed bg-white border-4 rounded-lg ' +
              className
            }
            key={key + '-tag-' + i}
          >
            <span className="px-2 flex-shrink-0 flex-grow-0">{icon}</span>
            <span className="flex-shrink-0 flex-grow-0 text-xs px-2">
              {value}
            </span>
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

import React from 'react'
import * as PropTypes from 'prop-types'
import Img from 'gatsby-image'

export const CommitteePanel = ({ name, role, description, keySkill, favouriteRace, image}) => (
    <div className="flex flex-col w-full bg-white-manyharrier">
        <div className='flex flex-col md:flex-row w-full'>
            <Img fixed={image} alt={'Photo of ' + name}/>
            <div className="flex content-center m-3 text-base text-black">
                <div className='content' dangerouslySetInnerHTML={{__html: description}}/>
                <p className="font-semibold text-red-manyharrier">Key Skill:</p>
                <p>{keySkill}</p>
                <p className="font-semibold text-red-manyharrier">Favourite Race:</p>
                <p>{favouriteRace}</p>
            </div>
        </div>
        <div className="text-center text-base text-black font-semibold self-center py-1">{name + "\t\t" + role}</div>
    </div>
)

CommitteePanel.propTypes = {
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    description: PropTypes.node.isRequired,
    keySkill: PropTypes.string,
    favouriteRace: PropTypes.string,
    image: PropTypes.object.isRequired
}
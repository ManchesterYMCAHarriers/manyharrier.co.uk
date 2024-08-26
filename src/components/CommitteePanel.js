import React from 'react'
import * as PropTypes from 'prop-types'
import Img from 'gatsby-image'

export const CommitteePanel = ({ name, role, description, keySkill, favouriteRace, image}) => (
    <div className="flex flex-col w-full bg-white-manyharrier">
        <div className='flex flex-col md:flex-row w-full'>
            <Img fixed={image} alt={'Photo of ' + name}/>
            <div className="flex flex-col content-center m-3 h-full w-1/2 text-base text-black">
                <div className='content' dangerouslySetInnerHTML={{__html: description}}/>
                <p className="font-semibold text-red-manyharrier">Key Skill:</p>
                <p>{keySkill}</p>
                <p className="font-semibold text-red-manyharrier">Favourite Race:</p>
                <p>{favouriteRace}</p>
            </div>
        </div>
        <div className="text-center w-full text-base text-black font-semibold self-center py-1"><span>{name + "\t\t"}</span> <span className='text-red-manyharrier'>{role}</span></div>
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
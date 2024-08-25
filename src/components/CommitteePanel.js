import React from 'react'
import * as PropTypes from 'prop-types'
import Img from 'gatsby-image'

export const CommitteePanel = ({ name, role, description, keySkill, favouriteRace, image}) => (
    <div className="flex flex-col w-64 bg-white-manyharrier">
        <div className="relative h-96">
        <Img fixed={image} alt={'Photo of ' + name} className={`absolute inset-0 h-full w-full z-0 opacity-10`} />
            <div className="absolute inset-0 z-10 content-center m-3 text-base text-black">
            <p>{description}</p>
            <p className="font-semibold text-red-manyharrier"><br/>Key Skill:</p>
            <p>{keySkill}</p>
            <p className="font-semibold text-red-manyharrier">Favourite Race:</p>
            <p>{favouriteRace}</p>
            </div>
            <Img fixed={image} alt={'Photo of ' + name} className={`absolute inset-0 h-full w-full z-0 opacity-10`} />
        </div>
        <div className="text-center text-base text-black font-semibold self-center py-1"><span>{name}</span> <span className="text-red-600">{`&nbsp&nbsp` + role}</span></div>
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
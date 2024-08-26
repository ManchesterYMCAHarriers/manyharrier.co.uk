import React from 'react'
import * as PropTypes from 'prop-types'
import Img from 'gatsby-image'

export const CommitteePanel = ({ name, role, description, keySkill, favouriteRace, image}) => (
    <div className="flex flex-col w-full bg-white-manyharrier">
        <div className='flex flex-col md:flex-row order-1 md:order-2 justify-center md:justify-normal w-full'>
            <Img fixed={image} alt={'Photo of ' + name} className={"flex"}/>
            <div className="flex flex-col content-center m-3 md:h-full w-full md:w-1/2 text-base text-black">
                <div className='content' dangerouslySetInnerHTML={{__html: description}}/>
                <p className="w-full font-semibold mt-2 text-red-manyharrier">Key Skill:</p>
                <p className='w-full'>{keySkill}</p>
                <p className="w-full font-semibold mt-2 text-red-manyharrier">Favourite Race:</p>
                <p className='w-full'>{favouriteRace}</p>
            </div>
        </div>
        <div className="order-2 md:order-1 text-center w-full text-base text-black font-semibold self-center py-1"><span>{name + "&emsp &emsp"}</span> <span className='text-red-manyharrier'>{role}</span></div>
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
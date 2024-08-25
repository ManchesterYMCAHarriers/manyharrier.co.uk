import React from 'react'
import * as PropTypes from 'prop-types'
import Img from 'gatsby-image'

export const CommitteePanel = ({ name, role, description, keySkill, favouriteRace, image}) => (
    <div className="flex flex-col w-64 bg-white-manyharrier">
        <div className="relative h-96">
            <Img 
                fixed={image}
                alt={'Photo of ' + name} 
                style={{
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    inset: 0,
                    objectFit: 'cover',
                    opacity: 0.1,
                }}
                className="z-0" 
            />
            <div className="absolute inset-0 z-10 content-center m-3 text-base text-black">
                <div className='content' dangerouslySetInnerHTML={{__html: description}}/>
                <p className="font-semibold text-red-manyharrier"><br/>Key Skill:</p>
                <p>{keySkill}</p>
                <p className="font-semibold text-red-manyharrier">Favourite Race:</p>
                <p>{favouriteRace}</p>
            </div>
            <Img 
                fixed={image} 
                alt={'Photo of ' + name} 
                style={{
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    inset: 0,
                    objectFit: 'cover',
                    opacity: 1,
                }}
                className="z-20 hover:opacity-0 duration-300"
            />
        </div>
        <div className="text-center text-base text-black font-semibold self-center py-1">{name}</div>
        <div className="text-center text-base font-semibold self-center text-red-manyharrier mb-2">{role}</div>
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
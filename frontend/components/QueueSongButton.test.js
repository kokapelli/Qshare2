import { QueueSongButton } from './QueueSongButton'
import { shallow, configure } from 'enzyme'
import * as renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-16'
import React from 'react'
import { findByTestAttr } from '../utils/'

configure({ adapter: new Adapter() });

const track = {
    name: "Qshare",
    artists: [
        {
            name: "Hampus"
        },
        {
            name: "Brent"
        },
        {
            name: "Valter"
        }
    ]
}

describe('QueueSongButton Snapshot', () => {

    it('matches the snapshot', () => {
        const tree = renderer.create(
        <QueueSongButton track={track}/>
        ).toJSON()
        expect(tree).toMatchSnapshot()
    })
})

describe('QueueSongButton Units', () => {

    beforeEach(()=>{
       this.component = shallow(<QueueSongButton track={track}/>)
    })

    it('component renders properly', () => {
        const rendered = renderer.create(<QueueSongButton track={track}/>).toJSON()
        expect(rendered).toBeTruthy()
    });

    it('Song Details should be correct given mock input', () => {
        const details = findByTestAttr(this.component, 'songDetails')
        const expected = [track.name, " - ", track.artists[0].name]
        expect(details.props().children).toEqual(expected)
        })

})
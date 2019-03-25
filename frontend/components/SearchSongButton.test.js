import { SearchSongButton } from './SearchSongButton'
import { shallow, configure } from 'enzyme'
import * as renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-16'
import React from 'react'
import { findByTestAttr } from '../utils/'

configure({ adapter: new Adapter() });

const item = {
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

describe('SearchSongButton Snapshot', () => {

    it('Matches the snapshot', () => {
        const tree = renderer.create(
        <SearchSongButton />
        ).toJSON()
        expect(tree).toMatchSnapshot()
    })
})

describe('SearchSongButton Units', () => {

    beforeEach(()=>{
       this.component = shallow(<SearchSongButton/>)
    })

    it('Component renders properly', () => {
        const rendered = renderer.create(<SearchSongButton/>).toJSON()
        expect(rendered).toBeTruthy()
    });

    it('Ddd song button should be clickable', () => {
        this.component.setProps({ item: item, queueID: "Test queueID" });
        const touchable = findByTestAttr(this.component, 'addSong')
        expect(touchable.exists()).toEqual(true) 
        expect(touchable.simulate('click')).toBeDefined()
        expect(touchable.simulate('click')).toEqual({})
        })

    it('Song Details should be correct given mock input', () => {
        this.component.setProps({ item: item, queueID: "Test queueID" });
        const details = findByTestAttr(this.component, 'songDetails')
        const expected = [item.name, " - ", item.artists[0].name]
        expect(details.props().children).toEqual(expected)
        })

    it('Add Song Icon should render', () => {
        const icon = findByTestAttr(this.component, 'songAddIcon')
        expect(icon).toBeDefined()
    });
})



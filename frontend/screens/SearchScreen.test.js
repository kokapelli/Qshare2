import { SearchScreen } from './SearchScreen'
import { shallow, configure } from 'enzyme'
import * as renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-16'
import React from 'react'
import { findByTestAttr } from '../utils/'

const initialState = {
  query: '',
  songs: []
}

const mockSongs = [{
      track: { name:"Test1" }
    },
    { track: { name:"Test2" }
    },
    { track: { name:"Test3" }
  }
] 

configure({ adapter: new Adapter() });

describe('SearchScreen Snapshot', () => {

  it('matches the snapshot', () => {
    const tree = renderer.create(
    <SearchScreen/>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('SearchScreen Units', () => {
  
  beforeEach(()=>{
    this.component = shallow(<SearchScreen props={initialState}/>)
  })

  it('Component renders properly', () => {
    const rendered = renderer.create(<SearchScreen/>).toJSON()
    expect(rendered).toBeTruthy()
  });

  it('Search button should be clickable', () => {
    const touchable = findByTestAttr(this.component, 'searchButton')
    expect(touchable.exists()).toEqual(true) 
    expect(touchable.simulate('click')).toBeDefined()
    expect(touchable.simulate('click')).toEqual({})
  })

  it('Search text field should contain placeholder', () => {
    const expected = "Search for a song"
    const textField = findByTestAttr(this.component, 'searchInput')
    expect(textField.props().placeholder).toEqual(expected)
  })

  it('Search text field should show query value', () => {
    const newQuery = "Test"
    this.component.setProps({ query: newQuery})
    const textField = findByTestAttr(this.component, 'searchInput')
    expect(textField.props().value).toEqual(newQuery)
  })

  it('Search text field query should change on query change', () => {
    const newQuery = "Test"
    let textField = findByTestAttr(this.component, 'searchInput')
    expect(textField.props().value).toBeUndefined()
    this.component.setProps({ ...initialState, query: newQuery})
    textField = findByTestAttr(this.component, 'searchInput')
    expect(textField.props().value).toEqual(newQuery)
  })
  
  it('Should print Songs Found when songs exist in the properties', () => {
    const expected = "Songs Found"
    this.component.setProps({ songs: mockSongs})
    const songsFound = findByTestAttr(this.component, 'songsFound')
    expect(songsFound.props().children).toEqual(expected)
  })

  it('Should display the correct amount of songs', () => {
    const expected = mockSongs.length
    this.component.setProps({ songs: mockSongs})
    const songList = findByTestAttr(this.component, 'songList')
    expect(songList.props().data).toHaveLength(expected)
  })

  it('Should display the correct songs', () => {
    this.component.setProps({ songs: mockSongs})
    const songList = findByTestAttr(this.component, 'songList')
    expect(songList.props().data[0].track.name).toEqual(mockSongs[0].track.name)
    expect(songList.props().data[1].track.name).toEqual(mockSongs[1].track.name)
    expect(songList.props().data[2].track.name).toEqual(mockSongs[2].track.name)
  })
})
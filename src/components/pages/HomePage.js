import React, {useState, useEffect} from 'react';
import axios from "axios";
import {Scrollbars} from 'react-custom-scrollbars';
import {Accordion} from './Accordion';

const HomePage = () => {

    const [nameSearch, setNameSearch] = useState('');
    const [tagSearch, setTagSearch] = useState('');
    const [data, setData] = useState([]); 

    useEffect(() => {      
        axios.get('https://api.hatchways.io/assessment/students')
        .then((response) => {            
            const students = response.data.students;            
            students.map(student => {
                student['tags'] = [];
            });            
            setData(students);       
            localStorage.setItem('students', JSON.stringify(students));
        })
    }, []);     

    const onChangeHandle = (e) => {        
        e.preventDefault(); 
        if(e.target.name == "name") setNameSearch(e.target.value);      
        if(e.target.name == "tag") setTagSearch(e.target.value);
    }

    const searchHandle = () => {
        let dbData = JSON.parse(localStorage.getItem('students'));

        const filterData = dbData.filter(item => {
            let tagFilter = false
            if(tagSearch == '') {tagFilter = true}
            else {
                item.tags.forEach(tag => {
                    if(tag.toLowerCase().includes(tagSearch)) {
                        tagFilter = true
                        return
                    }
                })
            }
            const nameFilter = nameSearch == '' ? true : item.firstName.toLowerCase().includes(nameSearch) || item.lastName.toLowerCase().includes(nameSearch);
            return tagFilter && nameFilter        
        });
        setData(filterData);
    }  

    return (
        <div className="main">
            <div className='main-container'>
                <Scrollbars>
                    <div className='search'>
                        <input type="text" className="search-name" name="name" placeholder='Search by name' value={nameSearch} onChange={(e) => onChangeHandle(e)} onKeyUp = {(e) => searchHandle(e)}/>
                        <input type="text" className='search-tag' name="tag" placeholder='Search by tag' value={tagSearch} onChange={(e) => onChangeHandle(e)} onKeyUp = {(e) => searchHandle(e)}/>
                    </div>
                    {data.map(item => (
                        <Accordion item={item} searchHandle={searchHandle} key={item.id} />
                    ))}
                </Scrollbars>          
            </div>
        </div>
    )
};

export { HomePage };
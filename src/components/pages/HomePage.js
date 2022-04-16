import React, {useState, useEffect} from 'react';
import axios from "axios";
import {Scrollbars} from 'react-custom-scrollbars';
// import Accordion from './Accordion';

let tags = [];

const HomePage = () => {

    const [nameSearch, setNameSearch] = useState('');
    const [tagSearch, setTagSearch] = useState('');
    const [data, setData] = useState([]);   
    const [openedIds, setOpenedIds ] = useState([]);
    const [tag, setTag] = useState('');
    const [addTagID, setAddTagID] = useState('');

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

    const calculateAverage = (array) => {
        let total = 0;
        let count = 0;

        const numberArray = array.map(Number);
    
        numberArray.forEach(function(item) {
            total += item;
            count++;
        });
    
        return (total / count).toFixed(2);
    }    

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

    const onClickHandle = (id) => {
        if(!openedIds.includes(id)){
            setOpenedIds([...openedIds, id])        
        }else {
            let temp = [...openedIds];           
            temp.splice(temp.indexOf(id), 1);
            setOpenedIds(temp);
        }
    }

    const addTagsHandle = (e, id) => {         
        e.preventDefault();
        setAddTagID(id);
        setTag(e.target.value)       
    }   

    const keydownHandle = (e, id) => {        
        let dbData = JSON.parse(localStorage.getItem('students'));
        let currentItem = dbData.filter(item => item.id == id);
        tags = currentItem[0]['tags'];

        if(e.keyCode === 13 && e.target.value != "") {   
            tags.push(tag);       
            dbData.filter(item => item.id == id)[0]["tags"] = tags;
            localStorage.setItem('students', JSON.stringify(dbData));
            setTag("");
            searchHandle();
        }
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
                        <div className='content' key={item.id}>
                            <div className='avatar'>
                                <img src={item.pic} alt="avartar"/>
                            </div>
                            <div className='description'>
                                <div className='full-name' onClick={()=>  onClickHandle(item.id)}>
                                    <h1>{item.firstName} {item.lastName}</h1>
                                    <div className="arrow_div">
                                        {openedIds.includes(item.id) ? <i className="fa fa-minus" aria-hidden="true"></i> : <i className="fa fa-plus" aria-hidden="true"></i>}
                                    </div>
                                </div>
                                <div className='email'>Email<span>:</span>{item.email}</div>
                                <div className='company'>Company<span>:</span>{item.company}</div>
                                <div className='skill'>Skill<span>:</span>{item.skill}</div>
                                <div className='average'>Average<span>:</span>{calculateAverage(item.grades)}%</div>                            
                                <div className={openedIds.includes(item.id) ? "acc_content acc-open" : "acc_content acc-close"}>
                                    {item.grades.map((grade, index_1) => (
                                        <div className='grades' key={index_1}>Test {index_1 +1}<span>:</span>{grade}%</div>
                                    ))}                           
                                </div>
                                <div className='tags'>
                                    {item.tags ? item.tags.map((tag_item, index_2) => (
                                        <span className='tag' key={index_2}>{tag_item}</span>
                                    )) : null}                        
                                </div>
                                <div className='add-tag'>
                                    <input type="text" placeholder='Add a tag' value={item.id == addTagID ? tag : ""} onChange={(e) => addTagsHandle(e, item.id)} onKeyDown={(e) => keydownHandle(e, item.id)}/>
                                </div>
                            </div>
                        </div>
                    ))}
                </Scrollbars>          
            </div>
        </div>
    )
};

export { HomePage };
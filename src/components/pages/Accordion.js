import React, {useState} from 'react';

let tags = [];

const Accordion = (props) => { 

    const [openedIds, setOpenedIds ] = useState([]);
    const [tag, setTag] = useState('');   

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

    const onClickHandle = (id) => {
        if(!openedIds.includes(id)){
            setOpenedIds([...openedIds, id])        
        }else {
            let temp = [...openedIds];           
            temp.splice(temp.indexOf(id), 1);
            setOpenedIds(temp);
        }
    }

    const addTagsHandle = (e) => {         
        e.preventDefault();        
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
            props.searchHandle();
        }
    }    
    
    return (                
        <div className='content' key={props.item.id}>
            <div className='avatar'>
                <img src={props.item.pic} alt="avatar"/>
            </div>
            <div className='description'>
                <div className='full-name' onClick={()=>  onClickHandle(props.item.id)}>
                    <h1>{props.item.firstName} {props.item.lastName}</h1>
                    <div className="arrow_div">
                        {openedIds.includes(props.item.id) ? <i className="fa fa-minus" aria-hidden="true"></i> : <i className="fa fa-plus" aria-hidden="true"></i>}
                    </div>
                </div>
                <div className='email'>Email<span>:</span>{props.item.email}</div>
                <div className='company'>Company<span>:</span>{props.item.company}</div>
                <div className='skill'>Skill<span>:</span>{props.item.skill}</div>
                <div className='average'>Average<span>:</span>{calculateAverage(props.item.grades)}%</div>                            
                <div className={openedIds.includes(props.item.id) ? "acc_content acc-open" : "acc_content acc-close"}>
                    {props.item.grades.map((grade, index_1) => (
                        <div className='grades' key={index_1}>Test {index_1 +1}<span>:</span>{grade}%</div>
                    ))}                           
                </div>
                <div className='tags'>
                    {props.item.tags ? props.item.tags.map((tag, index_2) => (
                        <span className='tag' key={index_2}>{tag}</span>
                    )) : null}                        
                </div>
                <div className='add-tag'>
                    <input type="text" placeholder='Add a tag' value={tag} onChange={(e) => addTagsHandle(e)} onKeyDown={(e) => keydownHandle(e, props.item.id)}/>
                </div>
            </div>
        </div>                   
    )
};

export { Accordion };
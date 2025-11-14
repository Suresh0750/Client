"use client"

import Modal from '@mui/material/Modal';
import SearchBar from '../SearchBar';
import Table from './Table'
import React, {useEffect, useState} from 'react';
import AddCategoryForm from './AddCategoryForm';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };



export const Category = ()=>{

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [searchval,setSearchVal] = useState('')

    useEffect(()=>{
        if(!open) return;

        const handleKeyDown = (event: KeyboardEvent)=>{
            const target = event.target as HTMLElement | null;
            const tagName = target?.tagName?.toLowerCase();
            const isEditable = target?.isContentEditable || ['input','textarea','select','button'].includes(tagName || '');

            if(!isEditable && (event.key === 'Enter' || event.key === 'Backspace')){
                event.preventDefault();
                event.stopPropagation();
            }
        }

        document.addEventListener('keydown',handleKeyDown,true);
        return ()=> document.removeEventListener('keydown',handleKeyDown,true);
    },[open])
    
    const scrollBarside = {
        display: "none"
    }
    const searchHandle = (value:string)=>{
        if(value){
            setSearchVal(value)
        }else{
            setSearchVal('')
        }
      }
    
    return(
        <>
            <div className='flex text-white justify-between m-2'> 
                <SearchBar search={searchHandle}/>
                <button className='bg-[#519668] rounded p-2 mr-10' onClick={handleOpen}>Add Category</button>      
            </div>
            <div>
                <Table searchValue={searchval || ''}/>   
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <div className='flex items-center justify-center min-h-screen bg-black/60'>
                        <AddCategoryForm isModal onClose={handleClose}/>
                    </div>
                    {/* <Box sx={style}  className='rounded'>
                        <Typography id="modal-modal-title" className='text-center' variant="h6" component="h2">
                            Add Category
                        </Typography>
                    <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                    >
                    </Box>
                        <AddCategoryForm/>
                    </Box> */}
                </Modal>
            </div>
           
        </>
    )
}


export default Category
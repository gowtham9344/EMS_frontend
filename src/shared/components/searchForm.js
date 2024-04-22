import React from 'react';
import './searchForm.css'

function SearchForm({ type , handleSearch, setSearchValue,searchValue, isSearched}) {
  const onSubmitHandler = (event)=>{
    event.preventDefault();
    if(!isSearched) {
        handleSearch(true)
    }
    else{
        handleSearch(false);
        setSearchValue("");
    }
  }

  const handleChange = (event)=>{
    setSearchValue(event.target.value)
  }

  return (
      <form className="d-flex formSearch" role="search" onSubmit={onSubmitHandler}>
        <input className="form-control me-2" type="search" name="key" placeholder={`${type === 'employee' ? 'Employee Name or Email' : 'Team Name'}`} aria-label="Search" value={searchValue} onChange={handleChange} />
        {
            <button className="btn btn-outline-success" type="submit">{!isSearched ? "Search" : "Cancel"}</button>
        }
      </form>
  );
}

export default SearchForm;

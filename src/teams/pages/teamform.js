import React, { useState, useEffect,useCallback,useContext } from 'react';
import './teamform.css'
import InputField from '../../shared/components/inputField';
import SelectField from '../../shared/components/selectField';
import CheckboxField from '../../shared/components/checkboxField';
import { AuthContext } from '../../shared/context/authContext';
import { toast } from 'react-toastify';

function TeamForm({ team,manager,employees,setIsEdit,onSubmitHandler }) {
  const [employeeList,setEmployeeList] = useState(employees.map((employee)=>{
    return employee.id
  }))
  const [managerId, setManagerId] = useState(manager ? manager.id : null);
  const [name,setName] = useState(team ? team.name: "")
  const [totalEmployeesList,setTotalEmployeesList] = useState(null)
  const [errors, setErrors] = useState({});
  const auth = useContext(AuthContext);

  const fetchAvailableEmployees = useCallback(async () => {
    const token = auth.token;
    try {
      const response = await fetch(`http://localhost:8000/employees/noteam`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const arr = data.map(employee => ({
        employeeID: employee.id,
        employeeName: employee.name
      }));
      const arr2 = employees.map(employee => ({
        employeeID: employee.id,
        employeeName: employee.name
      }));
      setTotalEmployeesList([...arr, ...arr2]);
    } catch (error) {
      toast.error("Error fetching teams",auth.toastOptions)
      console.error("Error fetching teams:", error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees,auth.token]);

  useEffect(() => {
    fetchAvailableEmployees();
  }, [fetchAvailableEmployees]);

  const handleValidation = () => {
    const errors = {};
  
    if(name === ''){
      errors.name = "Name can't be empty.";
    }
  
    return errors;
  };


  const handleManagerChange = (event) => {
    setManagerId(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmployeeChange = (event) => {
    const employeeId = parseInt(event.target.value);
    const isChecked = event.target.checked;
  
    if (isChecked) {
      setEmployeeList(prevEmployeeList => [...prevEmployeeList, employeeId]);
    } else {
      setEmployeeList(prevEmployeeList => prevEmployeeList.filter(id => id !== employeeId));
    }
  };

  const onSubmit = async(event)=>{
    event.preventDefault();

    const validationErrors = handleValidation();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await onSubmitHandler(name,managerId,employeeList,setErrors)
  }

  return (
    <form onSubmit={onSubmit}>
    <InputField
      label="Name"
      value={name}
      onChange={handleNameChange}
      required
      errors={errors}
    />
    {
      totalEmployeesList && totalEmployeesList.length > 0 &&
      <SelectField
        label="Select Manager"
        value={!managerId ? '' : managerId}
        options={[
          { value: '', label: 'No manager' },
          ...totalEmployeesList.map(employee => ({ value: employee.employeeID, label: employee.employeeName }))
        ]}
        onChange={handleManagerChange}
      />
    } 
    <div className="input-container1">
      <label>Select Members</label>
      {totalEmployeesList && totalEmployeesList.length > 0 ? (
        <div className="member-select-dropdown">
          {totalEmployeesList.map(employee => (
            <CheckboxField
              key={employee.employeeID}
              label={employee.employeeName}
              value={employee.employeeID}
              checked={employeeList.includes(employee.employeeID) || employee.employeeID === parseInt(managerId)}
              onChange={handleEmployeeChange}
              disabled={employee.employeeID === parseInt(managerId)}
            />
          ))}
        </div>
      ) : (
        <p className="no-employee">No employees available.</p>
      )}
    </div>
    <div className="submit-button">
      <button type="submit">Submit</button>
    </div>
  </form>
  );
}

export default TeamForm;

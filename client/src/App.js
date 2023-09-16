import React, { useState } from 'react';
import axios from 'axios';
import { Input, Button } from 'antd';
import './App.css'

function EmployeeManager() {
  const [employee, setEmployee] = useState({ name: '', email: '', department: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:3001/api/employees', employee);
      setEmployee({ name: '', email: '', department: '' }); 
    } catch (error) {
      console.error(error);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/employees', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'employees.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='img'>
    <div className='employee-manager'>
    <h1>Ysqure Employee Detail</h1>
    <form className='registration-form' onSubmit={handleSubmit}>
      <div className='form-group'>
        <label htmlFor="name" className='employee-input'>Name</label>
        <Input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your name"
          value={employee.name}
          onChange={handleChange}
          style={{ width: '60%' }}
        />
      </div>
      <div className='form-group'>
        <label htmlFor="email" className='employee-input'>Email</label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={employee.email}
          onChange={handleChange}
          style={{ width: '60%' }}
        />
      </div>
      <div className='form-group'>
        <label htmlFor="department" className='employee-input'>Department</label>
        <Input
          type="text"
          id="department"
          name="department"
          placeholder="Enter your department"
          value={employee.department}
          onChange={handleChange}
          style={{ width: '60%' }}
        />
      </div>
      <div className='form-group'>
        <Button className='employee-button' type="primary" htmlType="submit">
          Update
        </Button>
        <Button className='employee-button' onClick={handleExportCSV}>Export CSV</Button>
      </div>
    </form>
  </div>
  </div>
  
  );
}

export default EmployeeManager;
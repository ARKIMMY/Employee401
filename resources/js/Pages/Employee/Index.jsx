import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import './Index.css';


const decodeHtmlEntities = (text) => {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
};

export default function EmployeeIndex({ employees, query, currentPage }) {
  const [search, setSearch] = useState(query || '');
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  // ฟังก์ชันสำหรับการค้นหา
  const handleSearch = (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้า
    router.get('/employee', { search }); // ส่งคำค้นหาไปที่ URL
  };

  // ฟังก์ชันสำหรับจัดเรียงข้อมูล
  const handleSort = (column) => {
    const newSortOrder = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc'; 
    setSortColumn(column); 
    setSortOrder(newSortOrder); 
    router.get('/employee', { search, sort: column, order: newSortOrder }); // ส่งข้อมูลไปที่ URL
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนหน้า
  const handlePagination = (url) => {
    if (url) {
      const parsedUrl = new URL(url, window.location.origin); 
      const params = new URLSearchParams(parsedUrl.search); 

      if (search) params.set('search', search); 
      if (sortColumn) {
        params.set('sort', sortColumn); 
        params.set('order', sortOrder); 
      }

      router.get(`/employee?${params.toString()}`); // ส่งคำขอไปที่ URL
    }
  };

  // ฟังก์ชันสำหรับรีเฟรชข้อมูล
  const handleRefresh = () => {
    setSearch(''); // ล้างคำค้นหา
    setSortColumn(''); // ล้างคอลัมน์ที่จัดเรียง
    setSortOrder(''); // ล้างลำดับการจัดเรียง
    router.get('/employee'); // รีเฟรชหน้าโดยไม่ส่ง query
  };

  return (
    <div className="container">
      {/* หัวข้อ */}
      <h1 className="title">Employee List</h1>

      {/* ฟอร์มค้นหา */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={search} // ผูกกับสถานะ search
          onChange={(e) => setSearch(e.target.value)} // อัปเดตสถานะ search
        />
        <button type="submit" className="search-button">Search</button>
        <button type="button" onClick={handleRefresh} className="refresh-button">Refresh</button>
      </form>

      {/* ตารางข้อมูล */}
      {employees.data && employees.data.length > 0 ? (
        <div className="table-container">
          <table className="employee-table">
            <thead>
              <tr>
                {/* คอลัมน์ต่าง ๆ พร้อมปุ่มจัดเรียง */}
                <th>
                  ID
                  <button onClick={() => handleSort('emp_no')}>
                    {sortColumn === 'emp_no' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                  </button>
                </th>
                <th>
                  Name
                  <button onClick={() => handleSort('first_name')}>
                    {sortColumn === 'first_name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                  </button>
                </th>
                <th>
                  Last Name
                  <button onClick={() => handleSort('last_name')}>
                    {sortColumn === 'last_name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                  </button>
                </th>
                <th>
                  Birth Date
                  <button onClick={() => handleSort('birth_date')}>
                    {sortColumn === 'birth_date' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* แสดงรายการพนักงาน */}
              {employees.data.map((employee, index) => (
                <tr key={employee.emp_no} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                  <td>{employee.emp_no}</td>
                  <td>{employee.first_name}</td>
                  <td>{employee.last_name}</td>
                  <td>{employee.birth_date}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* การแบ่งหน้า */}
          <div className="pagination">
            {employees.links.map((link, index) => (
              <button
                key={index}
                onClick={() => link.url && handlePagination(link.url)} // เปลี่ยนหน้า
                disabled={!link.url} // ปิดปุ่มถ้าไม่มี URL
                className={`pagination-button ${link.active ? 'active' : ''}`}
              >
                {/* แปลง HTML Entities */}
                {decodeHtmlEntities(link.label || '')
                  .replace('Previous', ' Previous')
                  .replace('Next', 'Next')}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <h2 className="no-employees">No employees found.</h2>
      )}
    </div>
  );
}
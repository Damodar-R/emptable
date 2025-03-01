import '@ant-design/v5-patch-for-react-19';
import React, { useState,useRef} from "react";
import { AgGridReact } from "ag-grid-react";
import {ModuleRegistry, RowSelectionModule, TextFilterModule} from "ag-grid-community";
import { provideGlobalGridOptions } from 'ag-grid-community';
import { useEffect } from "react";

import axios from "axios";



import {
    ClientSideRowModelModule,
    PaginationModule,
    NumberFilterModule,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Modal, Button, Input, Select, Switch, message } from "antd";

import "antd/dist/reset.css";
import {FiltersToolPanelModule} from "ag-grid-enterprise";



const { Option } = Select;
provideGlobalGridOptions({ theme: "legacy" });

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    PaginationModule,
    NumberFilterModule,
    FiltersToolPanelModule,
    TextFilterModule,RowSelectionModule

]);

const EmployeeGrid = () => {
    const [rowData, setRowData] = useState([
        { id: 101, name: "John Doe", department: "HR", role: "Manager", salary: 75000, status: "Active" },
        { id: 102, name: "Jane Smith", department: "IT", role: "Developer", salary: 85000, status: "Active" },
        { id: 103, name: "Robert Brown", department: "Finance", role: "Analyst", salary: 65000, status: "Inactive" },
        { id: 104, name: "Emily White", department: "Marketing", role: "Executive", salary: 72000, status: "Active" },
        { id: 105, name: "David Wilson", department: "IT", role: "Designer", salary: 78000, status: "Inactive" },
        { id: 106, name: "John ", department: "HR", role: "Manager", salary: 75000, status: "Active" },
        { id: 107, name: "Jane ", department: "IT", role: "Developer", salary: 85000, status: "Active" },
        { id: 108, name: "Robert ", department: "Finance", role: "Analyst", salary: 65000, status: "Inactive" },
        { id: 109, name: "Emily ", department: "Marketing", role: "Executive", salary: 72000, status: "Active" },
        { id: 101, name: "John Doe", department: "HR", role: "Manager", salary: 75000, status: "Active" },
        { id: 102, name: "Jane Smith", department: "IT", role: "Developer", salary: 85000, status: "Active" },
        { id: 103, name: "Robert Brown", department: "Finance", role: "Analyst", salary: 65000, status: "Inactive" },
        { id: 104, name: "Emily White", department: "Marketing", role: "Executive", salary: 72000, status: "Active" },
        { id: 105, name: "David Wilson", department: "IT", role: "Designer", salary: 78000, status: "Inactive" },
        { id: 106, name: "John ", department: "HR", role: "Manager", salary: 75000, status: "Active" },
        { id: 107, name: "Jane ", department: "IT", role: "Developer", salary: 85000, status: "Active" },
        { id: 108, name: "Robert ", department: "Finance", role: "Analyst", salary: 65000, status: "Inactive" },
        { id: 109, name: "Emily ", department: "Marketing", role: "Executive", salary: 72000, status: "Active" },

      ]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editData, setEditData] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState(null);
    const gridRef = useRef(null);




    /*const handleOk = () => {
        if (editData.id && rowData.some(emp => emp.id=== editData.id)) {
            // Editing existing employee
            setRowData((prevData) =>
                prevData.map((emp) => (emp.id=== editData.id ? editData : emp))
            );
        } else {
            // Adding new employee
            setRowData((prevData) => [...prevData, { ...editData, id: rowData.length + 101 }]);
        }
        setIsModalVisible(false);
    };


    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: "Are you sure you want to delete this employee?",
            content: "This action cannot be undone.",
            okText: "Yes, Delete",
            cancelText: "Cancel",
            onOk: () => {

                    setRowData(prevData => prevData.filter(emp => emp.id !== id));
                    message.success("Employee deleted successfully").then(() => {
                      console.log("Success message displayed!");
                    });
                    
            },
            onCancel: () => {
              message.success("Deletion canceled").then(() => {
                console.log(" Deletion canceled successfully");
              });
            }
            
        });
    };*/
    

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get("http://localhost:3000/employees");
            setRowData(response.data);
        } catch (error) {
            message.error("Error fetching employees");
        }
    };

    const showModal = (data = null) => {
        setEditData(data || { name: "", department: "", role: "", salary: "", status: "Active" });
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            if (editData._id) {
                // Edit existing employee (PUT request)
                const response = await axios.put(`http://localhost:3000/employees/${editData._id}`, editData);
                setRowData((prevData) =>
                    prevData.map((emp) => (emp._id === response.data._id ? response.data : emp))
                );
                message.success("Employee updated successfully");
            } else {
                // Add new employee (POST request)
                const response = await axios.post("http://localhost:3000/employees", editData);
                setRowData((prevData) => [...prevData, response.data]);
                message.success("Employee added successfully");
            }
        } catch (error) {
            message.error("Error saving employee data");
        }
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleDelete = (_id) => {
        if (!_id) {
            message.error("Invalid employee ID");
            return;
        }
    
        Modal.confirm({
            title: "Are you sure you want to delete this employee?",
            content: "This action cannot be undone.",
            okText: "Yes, Delete",
            cancelText: "Cancel",
            onOk: () => {
                axios.delete(`http://localhost:3000/employees/${_id}`)
                    .then(() => {
                        setRowData((prevData) => prevData.filter((emp) => emp._id !== _id));
                        message.success("Employee deleted successfully");
                    })
                    .catch(() => {
                        message.error("Error deleting employee");
                    });
            }
        });
    };
    
    const filteredData = rowData.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (departmentFilter ? emp.department === departmentFilter : true) &&
        (statusFilter !== null ? emp.status === (statusFilter ? "Active" : "Inactive") : true)
    );
    const renderActions = (params) => (
        <div>
            <button className="btn btn-primary" onClick={() => showModal(params.data)}>Edit</button>
            <button className="btn btn-danger" onClick={() => handleDelete(params.data._id)} style={{ marginLeft: "15px" }}>Delete</button>
        </div>
    );
    const exportSelectedRows = () => {
        if (!gridRef.current) return;

        const selectedRows = gridRef.current.api.getSelectedRows() || [];

        if (selectedRows.length === 0) {
            message.warning("No rows selected for export.").then(() => console.log("Warning displayed"));

            return;
        }

        const csvContent = convertToCSV(selectedRows);
        downloadCSV(csvContent, "selected_employees.csv");
    };

    const convertToCSV = (rows) => {
        const headers = Object.keys(rows[0]).join(",");
        const data = rows.map(row => Object.values(row).join(",")).join("\n");
        return `${headers}\n${data}`;
    };

    const downloadCSV = (csvContent, filename) => {
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };
    const saveGridState = () => {
        if (!gridRef.current || !gridRef.current.api || !gridRef.current.columnApi) {
            console.warn("Grid API not available yet.");
            message.error("Grid is not ready yet!");
            return;
        }
    
        const gridState = {
            selectedRowIds: gridRef.current.api.getSelectedRows().map(row => row.id),
            columnState: gridRef.current.columnApi.getColumnState(),
            paginationState: gridRef.current.api.paginationGetCurrentPage(),
            pageSize: gridRef.current.api.paginationGetPageSize(),
            filterState: gridRef.current.api.getFilterModel(),  // Save filter state
        };
    
        localStorage.setItem("gridState", JSON.stringify(gridState));
        message.success("Grid state saved successfully!");
    };
    
    const restoreGridState = () => {
        const savedState = localStorage.getItem("gridState");
        if (!savedState) {
            message.warning("No saved state found.");
            return;
        }
    
        const { selectedRowIds, columnState, paginationState, pageSize, filterState } = JSON.parse(savedState);
    
        if (gridRef.current && gridRef.current.api) {
            // Restore column state
            if (columnState) {
                gridRef.current.columnApi.applyColumnState({
                    state: columnState,
                    applyOrder: true
                });
            }
    
            // Restore selected rows
            gridRef.current.api.forEachNode((node) => {
                if (selectedRowIds?.includes(node.data.id)) {
                    node.setSelected(true);
                }
            });
    
            // Restore pagination settings
            if (pageSize) {
                gridRef.current.api.paginationSetPageSize(pageSize);
            }
            if (paginationState !== undefined) {
                gridRef.current.api.paginationGoToPage(paginationState);
            }
    
            // Restore filter settings
            if (filterState) {
                gridRef.current.api.setFilterModel(filterState);
            }
    
            message.success("Grid state restored successfully!");
        }
    };
    
    const onGridReady = (params) => {
        gridRef.current = params.api; // Ensure gridRef points to `api` directly
        setTimeout(() => restoreGridState(), 500); // Delay restoring state for API readiness
    };
    
    
  

  



    const colDefs = [
        { field: "id", headerName: "Employee_ID", sortable: true, filter: true, checkboxSelection:true, headerCheckboxSelection: true, },
        { field: "name", headerName: "Name", sortable: true, filter: true  },
        { field: "department", headerName: "Department", sortable: true, filter: true },
        { field: "role", headerName: "Role", sortable: true, filter: true },
        { field: "salary", headerName: "Salary", sortable: true, filter: "agNumberColumnFilter", cellStyle: { textAlign: "right" } },
        { field: "status", headerName: "Status", sortable: true, filter: true },
        {
            headerName: "Actions",
            field: "acton",
            cellRenderer:renderActions }
    ];
return (
        <div>
            <div style={{ marginBottom: 10 }}>
                <Input placeholder="Search by Name" onChange={(e) => setSearchTerm(e.target.value)} style={{ width: 200, marginRight: 10 }} />
                <Select placeholder="Filter by Department" onChange={setDepartmentFilter} style={{ width: 200, marginRight: 10 }} allowClear>
                    <Option value="HR">HR</Option>
                    <Option value="IT">IT</Option>
                    <Option value="Finance">Finance</Option>
                    <Option value="Marketing">Marketing</Option>
                </Select>
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" onChange={setStatusFilter} style={{ marginRight: 10 }} />
                <Button type="primary" onClick={() => showModal({ id: rowData.length + 1, name: "", department: "", role: "", salary: "", status: "Active" })}>Add Employee</Button>
                <Button type="primary" onClick={exportSelectedRows} style={{ margin: 10 }}>
                    Export Selected as CSV
                </Button>
                <Button onClick={saveGridState} type="primary" style={{ marginLeft: 10 }}>
               
                 Save Grid State
                 </Button>
                 <Button onClick={restoreGridState} type="primary" style={{ marginLeft: 10 }}>
                Restore Grid State
            </Button>



            </div>

            <div className="ag-theme-alpine" style={{ height: "550px", width: "100%" }}>

                <AgGridReact
                    ref={gridRef}
                    onGridReady={onGridReady}
                    rowData={filteredData}
                    columnDefs={colDefs}
                    pagination={true}
                    paginationPageSize={10}
                    paginationPageSizeSelector={[10, 20, 50, 100]}
                    rowSelection= "multiple"
                    



                />



            </div>

            <Modal title={editData?.id? "Edit Employee" : "Add Employee"} open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <label>Name:</label>
                <Input name="name" value={editData?.name} onChange={handleChange} />
                <br /><br />
                <label>Department:</label>
                <Select name="department" value={editData?.department} onChange={(value) => setEditData({ ...editData, department: value })} style={{ width: "100%" }}>
                    <Option value="HR">HR</Option>
                    <Option value="IT">IT</Option>
                    <Option value="Finance">Finance</Option>
                    <Option value="Marketing">Marketing</Option>
                </Select>
                <br /><br />
                <label>Role:</label>
                <Input name="role" value={editData?.role} onChange={handleChange} />
                <br /><br />
                <label>Salary:</label>
                <Input name="salary" type="number" value={editData?.salary} onChange={handleChange} />
                <br /><br />
                <label>Status:</label>
                <Select value={editData?.status} onChange={(value) => setEditData({ ...editData, status: value })} style={{ width: "100%" }}>
                    <Option value="Active">Active</Option>
                    <Option value="Inactive">Inactive</Option>
                </Select>
            </Modal>
        </div>
    );
};

export default EmployeeGrid;

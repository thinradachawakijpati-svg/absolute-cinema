import React, { useState } from 'react'

function SearchMovie() {
    const [searchQuery, setSearchQuery] = useState("")

    const handleSearch = (e) => {
        e.preventDefault()
        // ยังดึงbackendมาใช้
        alert("กำลังค้นหาหนังชื่อ: " + searchQuery)
    }

    return (
        <div className="bg-dark text-white min-vh-100 p-5">
            <div className="container">
                <h1 className="text-center mb-4">ค้นหาภาพยนตร์ </h1>

                <form onSubmit={handleSearch} className="d-flex justify-content-center">
                    <input
                        type="text"
                        className="form-control w-50 me-2"
                        placeholder="พิมพ์ชื่อหนังที่ต้องการค้นหา..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="btn btn-warning">ค้นหา</button>
                </form>

            </div>
        </div>
    )
}

export default SearchMovie
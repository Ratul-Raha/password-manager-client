import { useState } from "react";
import { TextField } from "@material-ui/core";

const Search = ({ data, setData }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filteredData = data.filter((item) =>
      item.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setData(filteredData);
  };

  return (
    <TextField
      label="Search"
      variant="outlined"
      size="small"
      value={searchTerm}
      onChange={handleSearch}
      style={{marginBottom:"10px"}}
    />
  );
};

export default Search;
import Table from 'react-bootstrap/Table';

const ChartTable = ({data}) => {
  return (
  <Table striped bordered hover variant = {"light"} style={{fontSize:"16px",fontFamily:"Fira Code"}}>
      <thead>
        <tr>
          {Object.keys(data[0]).map((key, index) => (
            <th key={index} style={{backgroundColor:"#537188",color:"whitesmoke"}}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {Object.values(row).map((value, colIndex) => (
              <td key={colIndex}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default ChartTable;
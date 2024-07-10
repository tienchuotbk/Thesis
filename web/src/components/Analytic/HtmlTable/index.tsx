interface Props {
    headers: string[];
    values: any[];
  }
  
  export default function HtmlTable({ headers, values }: Props) {


    return (
        <table className="styled-table">
            <thead>
                <tr>
                    {headers.map((val)=> (<td>{val}</td>))}
                    {/* <th>Name</th>
                    <th>Points</th> */}
                </tr>
            </thead>
            <tbody>
                {values.map((val)=> (
                    <tr>
                        {val.map((subval: string) => (
                            <td>{subval}</td>
                        ))}
                    </tr>
                ))}
                {/* <tr>
                    <td>Dom</td>
                    <td>6000</td>
                </tr>
                <tr className="active-row">
                    <td>Melissa</td>
                    <td>5150</td>
                </tr> */}
            </tbody>
</table>
    )
}
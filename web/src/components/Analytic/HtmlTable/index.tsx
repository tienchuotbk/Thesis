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
                </tr>
            </thead>
            <tbody>
                {values?.map((val)=> (
                    <tr>
                        {val.map((subval: string) => (
                            <td>{subval}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
</table>
    )
}
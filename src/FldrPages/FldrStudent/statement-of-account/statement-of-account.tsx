import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { School } from "lucide-react"

import { StatementOfAccountCol } from "@/FldrTypes/statementofaccount"
import { useState, useEffect } from "react"


import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"


// Sample data - this would come from an API or database
const studentInfo = {
  number: "0000001",
  name: "Wency Aldas Baterna",
  program: "Bachelor of Science in Information Technology",
  year: "4th Year",
  term: "2nd Semester, AY 2024-2025",
  college: "College of Computer Studies",
  status: "Regular",
}

const fees = [
  { description: "Tuition Fee (21 units × ₱1,500.00)", amount: 31500.0 },
  { description: "Miscellaneous Fee", amount: 5000.0 },
  { description: "Laboratory Fee (Computer)", amount: 3500.0 },
  { description: "Library Fee", amount: 1000.0 },
  { description: "Athletic Fee", amount: 800.0 },
  { description: "Cultural Fee", amount: 500.0 },
  { description: "Development Fee", amount: 2000.0 },
  { description: "Student Council Fee", amount: 300.0 },
  { description: "ID Validation", amount: 150.0 },
]

const payments = [
  { date: "June 15, 2024", orNumber: "OR-78945", description: "Down Payment", amount: 15000.0 },
  { date: "July 20, 2024", orNumber: "OR-79123", description: "First Installment", amount: 10000.0 },
]

const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0)
const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0)
const balance = totalFees - totalPayments



export default function SOAComponent() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const [statements, setStatements] = useState<StatementOfAccountCol[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchStatementOfAccount = async () => {
      try {
        const response = await fetch("https://localhost:7092/api/WEBAPI/StatementOfAccount/GroupFees")
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data: StatementOfAccountCol[] = await response.json()
        setStatements(data)
      } catch (err) {
        console.error("Error: ", err);
      } finally {
        setLoading(false)
      }
    }
    fetchStatementOfAccount()
  }, [])

  const groupedStatements = {
    subjects: statements.filter(item => item.rateTypeDesc === "Subjects"),
    laboratory: statements.filter(item => item.rateTypeDesc === "Laboratory"),
    miscellaneous: statements.filter(item => item.rateTypeDesc === "Miscellaneous"),
    others: statements.filter(item => item.rateTypeDesc === "Others"),
  }

  return (
    <Card className="mb-8 overflow-hidden border-t-4 border-t-[#2596be] print:border print:shadow-none">
      <CardContent className="p-0">
        {/* Header */}
        <div className="border-b bg-white dark:bg-transparent p-6">
          <div className="flex flex-col items-center justify-center text-center md:flex-row md:justify-start md:text-left">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border text-white md:mb-0 md:mr-6">
              <Avatar className="rounded-full w-13 h-13">
                <AvatarImage src='/cbytelogo.jpg' alt='logo' />
                <AvatarFallback className="rounded-lg">CB</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#2596be] md:text-2xl">CBytes University</h1>
              <p className="text-sm text-gray-500">Room 304, 3rd Floor, Yusay Building, Araneta St., Bacolod City</p>
              <p className="text-sm text-gray-500">Tel: (02) 8123-4567 | Email: registrar@cbyte.edu.ph</p>
            </div>
          </div>
        </div>


        {/* Statement Title */}
        <div className="border-b bg-gray-50 dark:bg-transparent p-4 text-center">
          <h2 className="text-xl font-bold">STATEMENT OF ACCOUNT</h2>
          <p className="text-sm text-gray-600">{studentInfo.term}</p>
        </div>

        {/* Student Information */}
        <div className="border-b p-4">
          <h3 className="mb-3 font-semibold">STUDENT INFORMATION</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <p className="grid grid-cols-2">
                <span className="text-sm font-medium text-gray-500">Student Number:</span>
                <span className="text-sm">{studentInfo.number}</span>
              </p>
              <p className="grid grid-cols-2">
                <span className="text-sm font-medium text-gray-500">Name:</span>
                <span className="text-sm">{studentInfo.name}</span>
              </p>
              <p className="grid grid-cols-2">
                <span className="text-sm font-medium text-gray-500">Program:</span>
                <span className="text-sm">{studentInfo.program}</span>
              </p>
            </div>
            <div>
              <p className="grid grid-cols-2">
                <span className="text-sm font-medium text-gray-500">Year Level:</span>
                <span className="text-sm">{studentInfo.year}</span>
              </p>
              <p className="grid grid-cols-2">
                <span className="text-sm font-medium text-gray-500">College:</span>
                <span className="text-sm">{studentInfo.college}</span>
              </p>
              <p className="grid grid-cols-2">
                <span className="text-sm font-medium text-gray-500">Status:</span>
                <span className="text-sm">{studentInfo.status}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Assessment */}
        <div className="border-b p-4">
          <h3 className="mb-3 font-semibold">ASSESSMENT OF FEES</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-3/4">Subject Fees</TableHead>
                <TableHead className="w-3/4">noUnits</TableHead>
                <TableHead className="text-right">Rate Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedStatements.subjects.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.subjectCode }</TableCell>
                  <TableCell>{item.noUnits}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.rateAmount)}</TableCell>
                </TableRow>
              ))}
              <TableHead className="w-3/4">Laboratory Fees</TableHead>
                {groupedStatements.laboratory.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.subjectCode}</TableCell>
                  <TableCell>{item.noUnits}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.rateAmount)}</TableCell>
                </TableRow>
              ))}
          <TableHead className="w-3/4">Miscellaneous Fees</TableHead>
                            {groupedStatements.miscellaneous.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.subjectCode}</TableCell>
                  <TableCell>{item.noUnits}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.rateAmount)}</TableCell>
                </TableRow>
              ))}
          <TableHead className="w-3/4">Other Fees</TableHead>
          {groupedStatements.others.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.subjectCode}</TableCell>
                  <TableCell>{item.noUnits}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.rateAmount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Laboratory
        <div className="border-b p-4">
          <h3 className="mb-3 font-semibold">LABORATORY</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-3/4">Subject Code</TableHead>
                <TableHead className="w-3/4">noUnits</TableHead>
                <TableHead className="text-right">Rate Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedStatements.laboratory.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.subjectCode}</TableCell>
                  <TableCell>{item.noUnits}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.rateAmount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div> */}

        {/* Miscellaneous
        <div className="border-b p-4">
          <h3 className="mb-3 font-semibold">MISCELLANEOUS</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-3/4">Subject Code</TableHead>
                <TableHead className="w-3/4">noUnits</TableHead>
                <TableHead className="text-right">Rate Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedStatements.miscellaneous.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.subjectCode}</TableCell>
                  <TableCell>{item.noUnits}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.rateAmount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div> */}

        {/* Others
        <div className="border-b p-4">
          <h3 className="mb-3 font-semibold">OTHERS</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-3/4">Subject Code</TableHead>
                <TableHead className="w-3/4">noUnits</TableHead>
                <TableHead className="text-right">Rate Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedStatements.others.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.subjectCode}</TableCell>
                  <TableCell>{item.noUnits}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.rateAmount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div> */}

        <div className="flex justify-between mt-4 px-4 font-semibold">
    <span>Total</span>
    <span className="text-right">

      {formatCurrency(statements.reduce((total, item) => total + item.rateAmount, 0))}
    </span>
  </div>


        {/* Payments */}
        <div className="border-b p-4">
          <h3 className="mb-3 font-semibold">PAYMENT HISTORY</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>OR Number</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment, index) => (
                <TableRow key={index}>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.orNumber}</TableCell>
                  <TableCell>{payment.description}</TableCell>
                  <TableCell className="text-right">{formatCurrency(payment.amount)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="font-bold">
                  TOTAL PAYMENTS
                </TableCell>
                <TableCell className="text-right font-bold">{formatCurrency(totalPayments)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        <div className="border-b bg-gray-50 dark:bg-transparent p-4">
          <div className="flex justify-between">
            <h3 className="font-bold">REMAINING BALANCE:</h3>
            <p className={`text-xl font-bold ${balance > 0 ? "text-red-600" : "text-green-600"}`}>
              {formatCurrency(balance)}
            </p>
          </div>
        </div>

        {/* Payment Schedule */}
        <div className="border-b p-4">
          <h3 className="mb-3 font-semibold">PAYMENT SCHEDULE</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Due Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>August 15, 2024</TableCell>
                <TableCell>Second Installment</TableCell>
                <TableCell className="text-right">{formatCurrency(8000.0)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>September 15, 2024</TableCell>
                <TableCell>Final Installment</TableCell>
                <TableCell className="text-right">{formatCurrency(balance - 8000.0)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="p-4">
          <div className="mb-6 text-sm text-gray-600">
            <p className="mb-2">
              <strong>Note:</strong> This statement reflects your current account status as of{" "}
              {new Date().toLocaleDateString()}.
            </p>
            <p className="mb-2">Please present this statement when making payments at the Cashier's Office.</p>
            <p>
              For inquiries, please contact the Accounting Office at accounting@cbyte.edu.ph or call (02) 8123-4567 local
              123.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 pt-8">
            <div className="text-center">
              <div className="mb-2 border-t border-gray-400 pt-2">
                <p className="font-medium">Eva Elfie</p>
                <p className="text-sm text-gray-600">Accounting Officer</p>
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 border-t border-gray-400 pt-2">
                <p className="font-medium">Johnny Sins, CPA</p>
                <p className="text-sm text-gray-600">University Accountant</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// import { useEffect, useState } from "react";
// import axios from "axios";

// interface StatementOfAccount {
//   noUnits: number;
//   rateAmount: number;
//   entryRowNum: number;
//   subjectCode: string; 
// }

// const StatementOfAccount = () => {
//   const [data, setData] = useState<StatementOfAccount[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchStatementOfAccount = async () => {
//       try {
//         const response = await axios.get("https://localhost:7092/api/WEBAPI/StatementOfAccount/Fees");
//         setData(response.data);
//       } catch (err) {
//         setError("Error fetching data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStatementOfAccount();
//   }, []);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Statement of Account</h2>
//       <table border={1} cellPadding={10} style={{ borderCollapse: "collapse", width: "100%" }}>
//         <thead>
//           <tr>
//             <th>No. of Units</th>
//             <th>Rate Amount</th>
//             <th>Entry Row Num</th>
//             <th>Subject Code</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr key={index}>
//               <td>{item.noUnits}</td>
//               <td>{item.rateAmount}</td>
//               <td>{item.entryRowNum}</td>
//               <td>{item.subjectCode}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default StatementOfAccount;

import React from 'react'
import UseFetchGateReport from '../../hooks/UseFechGateReport'

export default function GateList() {
const { data, isLoading, isError } = UseFetchGateReport();
console.log(data?.data)
  return (
    <div>GateList</div>
  )
}

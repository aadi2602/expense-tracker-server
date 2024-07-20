import React, { useEffect, useState } from 'react';
import './Home.css';
import toast, { Toaster } from 'react-hot-toast'
import axios, { all } from 'axios'
import TracsactionCard from '../../component/TracsactionCard/TracsactionCard';
import Imgadd from './add.png'
import { Link } from 'react-router-dom';

function Home() {
  const [user, setUser] = useState('')
  const [transactions, setTransactions] = useState([])
  const [netIncome, setNetIncome] = useState(0)
  const [netExpecse, setNetExpense] = useState(0)

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))

    if (currentUser) {
      setUser(currentUser)
    }

    if (!currentUser) {
      window.location.href = '/login'
    }
  }, [])

  const loadTransactions = async () => {
    if (!user._id) {
      return
    }
    toast.loading('Loding transactions...')

    const responce = await axios.get(`${process.env.REACT_APP_API_URL}/transactions?userId=${user._id}`)

    const allTransactions = responce.data.data
    toast.dismiss()

    setTransactions(allTransactions)
  }

  useEffect(() => {
    loadTransactions()
  }, [user])

  useEffect(() => {
    let income = 0
    let expense = 0

    transactions.forEach((transaction) => {
      if (transaction.type === 'credit') {
        income += transaction.amount
      }
      else {
        expense += transaction.amount
      }
    })

    setNetIncome(income)
    setNetExpense(expense)

  }, [transactions])


  return (
    <div>
      <h1 className='home-greeting'>Hello {user.fullName}</h1>
      <h2 className='home-heading'>Welcome to the Expecse Tracker</h2>

      <span className='home-logout' onClick={() => {
        localStorage.clear()
        toast.success('Logged out successfully ')

        setTimeout(() => {
          window.location.href = '/login'
        }, 3000)
      }}>
        Logout
      </span>

      <div className='net-transaction-value'>
        <div className='net-transaction-value-item'>
          <span className='net-transaction-value-amount'> + {netIncome}</span>
          <span className='net-transaction-value-title'>Net Income</span>
        </div>

        <div className='net-transaction-value-item'>
          <span className='net-transaction-value-amount'> - {netExpecse}</span>
          <span className='net-transaction-value-title'>Net Expecse</span>
        </div>

        <div className='net-transaction-value-item'>
          <span className='net-transaction-value-amount'>{netIncome - netExpecse}</span>
          <span className='net-transaction-value-title'>Net Balance</span>
        </div>
      </div>

      <div className='transactions-container'>
        {
          transactions.map((transaction) => {
            const { _id, title, amount, category, type, createdAt } = transaction

            return (<TracsactionCard
              key={_id}
              _id={_id}
              title={title}
              amount={amount}
              category={category}
              type={type}
              createdAt={createdAt}
              loadTransactions={loadTransactions}
            />)
          })
        }
      </div>

      <Link to='/add-transaction' className='add-transaction-link'>
        <img src={Imgadd} alt='Add Transaction ' className='add-transaction' />
      </Link>

      <Toaster />
    </div>
  )
}

export default Home
import React from 'react'
import Layout from '../components/Layout'
import Button from 'antd/lib/button'
import 'antd/lib/button/style/css'
import { Link } from 'gatsby'

const IndexPage = () => {
  return (
    <Layout>
      <div>
        <div align="center">
          <br />
          <p
            style={{
              color: 'cornflowerblue',
              fontSize: 50,
              fontWeight: 'bold',
            }}
          >
            GraphQL-Sequelize-Generator
          </p>
          <h2>Documentation</h2>
          <br />
          <Link to="/1gettingStarted">
            <Button
              type="primary"
              size="large"
              icon="right-circle"
              style={{ marginRight: 10 }}
            >
              Get Started
            </Button>
          </Link>
          <Button
            type="primary"
            size="large"
            icon="github"
            href="https://github.com/teamstarter/graphql-sequelize-generator"
          >
            Github
          </Button>
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage

/** @jsx jsx */

import { css, jsx } from '@emotion/core'
import { AppError } from 'tv-app-common'

const styles = {
  outside: css`
    width: 100%;
  `,
  inside: css`
    border: solid 1px #ce1126;
    width: 60%;
    margin: 50px auto;
    border-radius: 4px;
    background-color: #fdf3f4;
  `,
  header: css`
    background-color: #ce1126;
    color: white;
    font-size: 24px;
    padding: 8px;
  `,
  body: css`
    padding: 8px
  `,
  message: css`
  `,
  details: css`
    margin-top: 8px;
    color: #757575;
    font-size: 12px
  `
}

function getCodeAndMessage(error) {
  if (error instanceof AppError) {
    return { code: error.code, message: error.message }
  } else {
    return { code: 'internal_error', message: error.message }
  }
}

export default ({ error }) => {
  const {code, message} = getCodeAndMessage(error)

  return <div css={styles.outside}>
  <div css={styles.inside}>
    <div css={styles.header}>
      Oops! Something went wrong
    </div>
    <div css={styles.body}>
      <div css={styles.message}>
        <div>{message}</div>
      </div>
      <div css={styles.details}>
        <div>code: {code}</div>
      </div>
    </div>
  </div>
</div> 
}

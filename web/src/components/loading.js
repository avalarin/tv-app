/** @jsx jsx */

import { css, jsx } from '@emotion/core'
import ReactLoading from 'react-loading'

const styles = {
  outside: css`
    width: 100%;
  `,
  inside: css`
    width: 80px;
    margin: 150px auto;
  `
}

export default () => <div css={styles.outside}>
  <div css={styles.inside}>
    <ReactLoading type="bars" color="blacks"/>
  </div>
</div>


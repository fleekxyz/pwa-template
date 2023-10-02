import common from '../../common.module.css'
import styles from './TextRecordsInput.module.css'
import { FormField } from './FormField'

export const TextRecordsInput = () => {
  return (
    <form className={`${styles.form} ${common.column}`}>
      <FormField
        type="text"
        label="Bio"
        name="description"
        placeholder="Tell about yourself"
        defaultOpen
      />
      <FormField
        name="email"
        type="email"
        label="Email"
        placeholder="me@example.com"
        defaultOpen
      />
      <FormField
        type="url"
        label="Website"
        name="url"
        placeholder="https://example.com"
        defaultOpen
      />
      <FormField
        label="Telegram"
        name="telegram"
        placeholder="username"
        prefix="t.me/"
      />
      <FormField
        label="GitHub"
        name="github"
        prefix="github.com/"
        placeholder="username"
      />
      <FormField
        label="Twitter"
        name="twitter"
        prefix="twitter.com/"
        placeholder="username"
      />
      <FormField
        label="Reddit"
        name="reddit"
        prefix="reddit.com/u/"
        placeholder="username"
      />
      <FormField
        label="Discord"
        name="discord"
        prefix="discord.gg/"
        placeholder="user ID"
      />
      <button type="submit" className={`${common.button} ${styles.submit}`}>
        Next
      </button>
    </form>
  )
}

import fs from 'fs'
import path from 'path'

export async function getStaticProps() {
  const data = await fs.promises.readFile(
    path.join(process.cwd(), 'data.txt'),
    'utf8'
  )

  if (data.trim() === 'hide') {
    return {
      notFound: true,
      revalidate: 1,
    }
  }

  return {
    props: {
      hello: 'world',
      data,
    },
    revalidate: 1,
  }
}

export default function Page(props) {
  return (
    <>
      <p id="gsp">getStaticProps page</p>
      <p id="props">{JSON.stringify(props)}</p>
    </>
  )
}

import { google } from 'googleapis';

async function getData(page: number, limit: number, search= '') {

  const auth = await google.auth.getClient({ scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] });

  const sheets = google.sheets({ version: 'v4', auth });

  const offset = (page - 1) * limit
  const range = `Sheet1!A${offset + 2}:D${limit + 1}`

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: range,
  });

  const posts: any = response.data.values

  function filter(offset: number, limit: number, search: string) {
    // const data = posts.slice(offset, offset + limit)
    return posts?.filter((post: any) => {
      const nama = post[2].toLowerCase()
      const idMember = post[1].toLowerCase()
      const searchKey = search.toLowerCase()
      return nama.includes(searchKey) || idMember.includes(searchKey)
    })
  }

  const filteredPosts = filter(offset, limit, search)

  if (filteredPosts?.length > 0) {
    const header = ['No', 'id', 'Nama', 'Tabungan']
    const data = filteredPosts.map((row: any) => {
      const obj: any = {}
      header.forEach((column: any, i: any) => {
        obj[column] = row[i]
      })
      return obj
    })

    return data
  }

  // return posts  
  // return posts.json()
}

export default async function Home({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {

  const page =
    typeof searchParams.page === 'string' ? Number(searchParams.page) : 1

  const limit =
    typeof searchParams.limit === 'string' ? Number(searchParams.limit) : 10

  const search =
    typeof searchParams.search === 'string' ? searchParams.search : ''

  const data = await getData(page, limit, search)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section>
        {
          data?.map((post: any) => (
            <div key='id'>
              {post.No}
              {post.id}
              {post.Nama}
              {post.Tabungan}
            </div>
          ))
        }
      </section>
    </main>
  )
}

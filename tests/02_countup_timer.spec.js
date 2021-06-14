describe('カウントアップタイマー', () => {

  const rootUrl = 'http://localhost:3000/timekeeper/'

  const clearInput = async (id) => {
    const el = await page.$(id)
    await el.click({ clickCount: 3 })
    await el.press('Backspace')
  }

  const input = async (id, value) => {
    await clearInput(id)
    await page.type(id, value)
  }

  const checkTimer = async (min, sec) => {
    await expect(await page.$eval('#minute', el => el.value)).toBe(min)
    await expect(await page.$eval('#second', el => el.value)).toBe(sec)
  }

  const setTimer = async (min, sec) => {
    await input('#minute', min)
    await input('#second', sec)
  }

  beforeEach(async () => {
    const context = browser.defaultBrowserContext()
    context.overridePermissions(rootUrl, ['notifications'])
    await page.goto(rootUrl)    
  })

  test('ユーザーは、カウントアップタイマーとカウントダウンタイマーを選べること', async () => {
    // 最初、タイマータイプはカウントダウンであることを検証
    await expect(await page.$eval('#timer_type', el => el.value)).toBe('countdown')
    // タイマータイプをカウントアップに変更
    await page.select('#timer_type', 'countup')
    // タイマータイプがカウントアップであることを検証
    await expect(await page.$eval('#timer_type', el => el.value)).toBe('countup')
    // タイマータイプをカウントダウンに変更
    await page.select('#timer_type', 'countdown')
    // タイマータイプがカウントダウンであることを検証
    await expect(await page.$eval('#timer_type', el => el.value)).toBe('countdown')
  })

  test('ユーザーがカウントアップタイマーを選んだ場合、制限時間は入力不要であること', async () => {
    // タイマータイプをカウントアップに変更
    await page.select('#timer_type', 'countup')
    // タイマーがリードオンリーであることを検証
    await expect(await page.$eval('#minute', el => el.readOnly)).toBe(true)
    await expect(await page.$eval('#second', el => el.readOnly)).toBe(true)
  })

  test('ユーザーは、カウントアップタイマーが停止している場合、カウントアップタイマーを開始できること', async () => {
    // タイマータイプをカウントアップに変更
    await page.select('#timer_type', 'countup')
    // スタートボタンが押せることを検証
    await expect(await page.$eval('#button_start', el => el.disabled)).toBe(false)
    // タイマーが「00:00」であることを検証
    await checkTimer('00', '00')
    // スタートボタンを押す
    await page.click('#button_start')
    // 1.5秒待つ
    await page.waitForTimeout(1500)
    // タイマーが「00:01」であることを検証
    await checkTimer('00', '01')
    // スタートボタンが押せないことを検証
    await expect(await page.$eval('#button_start', el => el.disabled)).toBe(true)
  })

  test('ユーザーは、カウントアップタイマーを選択した場合、タイマーが「00:00」になること', async () => {
    // タイマーを「01:10」に設定
    await setTimer('01', '10')
    // タイマータイプをカウントアップに変更
    await page.select('#timer_type', 'countup')
    // タイマーが「00:00」であることを検証
    await checkTimer('00', '00')
  })

  test('ユーザーは、カウントアップタイマーが動いている場合、カウントアップタイマーを停止できること', async () => {
    // タイマータイプをカウントアップに変更
    await page.select('#timer_type', 'countup')
    // ストップボタンを押せないことを検証
    await expect(await page.$eval('#button_stop', el => el.disabled)).toBe(true)
    // スタートボタンを押す
    await page.click('#button_start')
    // 1秒待つ
    await page.waitForTimeout(1000)
    // ストップボタンを押せることを検証
    await expect(await page.$eval('#button_stop', el => el.disabled)).toBe(false)
    // ストップボタンを押す
    await page.click('#button_stop')
    // ストップボタンを押せないことを検証
    await expect(await page.$eval('#button_stop', el => el.disabled)).toBe(true)
  })

  test('ユーザーは、カウントアップタイマーが止まっている場合、カウントアップタイマーを再開できること', async () => {
    // タイマータイプをカウントアップに変更
    await page.select('#timer_type', 'countup')
    // タイマーが「00:00」であることを検証
    await checkTimer('00', '00')
    // スタートボタンを押す
    await page.click('#button_start')
    // 1500ms待つ
    await page.waitForTimeout(1500)
    // ストップボタンを押す
    await page.click('#button_stop')
    // タイマーが「00:01」であることを検証
    await checkTimer('00', '01')
    // 1500ms待つ
    await page.waitForTimeout(1500)
    // タイマーが「00:01」であることを検証
    await checkTimer('00', '01')
    // スタートボタンを押す
    await page.click('#button_start')
    // 1500ms待つ
    await page.waitForTimeout(1500)
    // タイマーが「00:02」であることを検証
    await checkTimer('00', '02')
  })

  test('ユーザーは、カウントアップタイマーが止まっている場合、カウントアップタイマーをリセットできること', async () => {
    // タイマータイプをカウントアップに変更する
    await page.select('#timer_type', 'countup')
    // リセットボタンが押せないことを検証
    await expect(await page.$eval('#button_reset', el => el.disabled)).toBe(true)
    // スタートボタンを押す
    await page.click('#button_start')
    // 1500秒待つ
    await page.waitForTimeout(1500)
    // ストップボタンを押す
    await page.click('#button_stop')
    // タイマーが「00:01」であることを検証
    await checkTimer('00', '01')
    // リセットボタンを押せることを検証
    await expect(await page.$eval('#button_reset', el => el.disabled)).toBe(false)
    // リセットボタンを押す
    await page.click('#button_reset')
    // タイマーが「00:00」であることを検証
    await checkTimer('00', '00')
    // リセットボタンが押せないことを検証
    await expect(await page.$eval('#button_reset', el => el.disabled)).toBe(true)
  })

  test('ユーザーは、カウントダウンタイマーを使ったあとでも、カウントアップタイマーを0秒にリセットできること', async () => {
    // カウントダウンタイマーを「01:00」に設定
    await setTimer('01', '00')
    // スタートボタンを押す
    await page.click('#button_start')
    // 1500ms待つ
    await page.waitForTimeout(1500)
    // ストップボタンを押す
    await page.click('#button_stop')
    // タイマーが「00:59」であることを検証
    await checkTimer('00', '59')
    // リセットボタンを押す
    await page.click('#button_reset')
    // タイマーが「01:00」であることを検証
    await checkTimer('01', '00')
    // タイマータイプをカウントアップに変更
    await page.select('#timer_type', 'countup')
    // タイマーが「00:00」であることを検証
    await checkTimer('00', '00')
    // スタートボタンを押す
    await page.click('#button_start')
    // 1500ms待つ
    await page.waitForTimeout(1500)
    // ストップボタンを押す
    await page.click('#button_stop')
    // タイマーが「00:01」であることを検証
    await checkTimer('00', '01')
    // リセットボタンを押す
    await page.click('#button_reset')
    // タイマーが「00:00」であることを検証
    await checkTimer('00', '00')
  })

  test('ユーザーは、カウントアップタイマーが動いている間、タイマータイプを変更できないこと', async () => {
    // タイマータイプをカウントアップに変更
    await page.select('#timer_type', 'countup')
    // タイマータイプを変更可能であることを検証
    await expect(await page.$eval('#timer_type', el => el.disabled)).toBe(false)
    // スタートボタンを押す
    await page.click('#button_start')
    // タイマータイプを変更できないことを検証
    await expect(await page.$eval('#timer_type', el => el.disabled)).toBe(true)
  })

  test('ユーザーは、カウントアップをタブで確認できること', async () => {
    // タイマータイプをカウントアップに変更
    await page.select('#timer_type', 'countup')
    // タブのタイトルが「00:00 | timekeeper」であることを検証
    await expect(await page.title()).toBe('00:00 | timekeeper')
    // タイマーを開始する
    await page.click('#button_start')
    // 1500ms待つ
    await page.waitForTimeout(1500)
    // タブのタイトルが「00:01 | timekeeper」に変化していることを検証
    await expect(await page.title()).toBe('00:01 | timekeeper')    
  })
})
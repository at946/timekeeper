describe('カウントダウンタイマー', () => {

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
  
  test('ユーザーは、カウントダウンタイマーを設定できること', async () => {
    // トップページにアクセスできていることを検証
    await expect(page.url()).toBe(rootUrl)    
    // デフォルトでは分秒はともに「00」
    await checkTimer('00', '00')
    // 分に10、秒に20を入力
    await setTimer('10', '20')
    // 設定した値になっていることを検証
    await checkTimer('10', '20')
  })

  test('ユーザーは、カウントダウンタイマーが1秒以上に設定されていないとき、タイマーをスタートできないこと', async () => {
    // 分、秒が「00」であることを検証
    await checkTimer('00', '00')
    // スタートボタンが押せないことを検証
    await expect(await page.$eval('#button_start', el => el.disabled)).toBe(true)
    // タイマーを「01:00」に設定
    await setTimer('01', '00')
    // スタートボタンが押せることを検証
    await expect(await page.$eval('#button_start', el => el.disabled)).toBe(false)
    // タイマーを「00:01」に設定
    await setTimer('00', '01')
    // スタートボタンを押せることを検証
    await expect(await page.$eval('#button_start', el => el.disabled)).toBe(false)
  })

  test('ユーザーは、カウントダウンタイマーが動いているとき、タイマーをスタートできないこと', async () => {
    // タイマーを「01:00」に設定
    await setTimer('01', '00')
    // タイマーをスタート
    await page.click('#button_start')
    // スタートボタンが押せないことを検証
    await page.waitForTimeout(100)
    await expect(await page.$eval('#button_start', el => el.disabled)).toBe(true)
  })

  test('ユーザーは、カウントダウンタイマーが1秒以上に設定されており、タイマーが止まっているとき、タイマーをスタートできること', async () => {
    // タイマーを「00:10」に設定
    await setTimer('00', '01')
    // タイマーボタンを押せることを検証
    await expect(await page.$eval('#button_start', el => el.disabled)).toBe(false)
    // タイマーを開始する
    await page.click('#button_start')
    await page.waitForTimeout(100)
    // タイマーを押せないことを検証
    await expect(await page.$eval('#button_start', el => el.disabled)).toBe(true)
    // タイマーを停止する
    await page.click('#button_stop')
    // スタートボタンを押せることを検証
    await expect(await page.$eval('#button_start', el => el.disabled)).toBe(false)
  })

  test('ユーザーが、カウントダウンタイマーを60分以上に設定してタイマーをスタートさせたとき、タイマーは60分に設定されること', async () => {
    // タイマーに「61:00」を入力
    await setTimer('61', '00')
    await page.$eval('#minute', el => el.blur())
    // タイマーが「60:00」になることを検証
    await checkTimer('60', '00')
    // タイマーに「00:3601」を入力
    await setTimer('00', '3601')
    await page.$eval('#second', el => el.blur())
    // タイマーが「60:00」になることを検証
    await checkTimer('60', '00')
    // タイマーに「60:01」を入力
    await setTimer('60', '1')
    await page.$eval('#second', el => el.blur())
    // タイマーが「60:00」になることを検証
    await checkTimer('60', '00')
  })

  test('ユーザーは、カウントダウンタイマーが動いているとき、タイマーを設定できないこと', async () => {
    // タイマーを設定できることを検証
    await expect(await page.$eval('#minute', el => el.readOnly)).toBe(false)
    await expect(await page.$eval('#second', el => el.readOnly)).toBe(false)
    // タイマーを「01:00」に設定する
    await setTimer('1', '0')
    // スタートボタンを押す
    await page.click('#button_start')
    // タイマーを設定できないことを検証
    await expect(await page.$eval('#minute', el => el.readOnly)).toBe(true)
    await expect(await page.$eval('#second', el => el.readOnly)).toBe(true)
    // ストップボタンを押す
    await page.click("#button_stop")
    // タイマーを設定できることを検証
    await expect(await page.$eval('#minute', el => el.readOnly)).toBe(false)
    await expect(await page.$eval('#second', el => el.readOnly)).toBe(false)
  })

  test('ユーザーは、タブで残り時間を確認できること', async () => {
    // タブのタイトルが「00:00 | timekeeper」であることを検証
    await expect(await page.title()).toBe('00:00 | timekeeper')
    // タイマーを「01:10」に設定する
    await setTimer('1', '10')
    await page.$eval('#second', el => el.blur())
    // タブのtitleが「01:10 | timekeeper」であることを検証
    await expect(await page.title()).toBe('01:10 | timekeeper')
    // タイマーを開始する
    await page.click('#button_start')
    // 1500ms待つ
    await page.waitForTimeout(1500)
    // タブのタイトルが「01:09 | timekeeper」に変化していることを検証
    await expect(await page.title()).toBe('01:09 | timekeeper')
  })

  test('ユーザーは、カウントダウンタイマーが動いているとき、タイマーをストップできること', async () => {
    // タイマーを「01:00」に設定
    await setTimer('1', '0')
    // タイマーを開始
    await page.click('#button_start')
    // タイマーが進んでいることを検証
    await page.waitForTimeout(1500)
    await checkTimer('00', '59')
    // ストップボタンを押せることを検証
    await expect(await page.$eval('#button_stop', el => el.disabled)).toBe(false)
    // ストップボタンを押す
    await page.click('#button_stop')
    // タイマーがストップしたことを検証
    await page.waitForTimeout(1500)
    await checkTimer('00', '59')
  })

  test('ユーザーは、カウントダウンタイマーが止まっているとき、タイマーをストップできないこと', async () => {
    // ストップボタンを押せないことを検証
    await expect(await page.$eval('#button_stop', el => el.disabled)).toBe(true)
    // タイマーを「01:00」に設定
    await setTimer('1', '0')
    // タイマーを開始
    await page.click('#button_start')
    // タイマーを停止
    await page.waitForTimeout(500)
    await page.click('#button_stop')
    // ストップボタンを押せないことを検証
    await expect(await page.$eval('#button_stop', el => el.disabled)).toBe(true)
  })

  test('ユーザーは、カウントダウンタイマーを止めたあと、再度タイマーをスタートできること', async () => {
    // タイマーを「00:10」に設定する
    await setTimer('0', '10')
    // タイマーをスタートする
    await page.click('#button_start')
    // タイマーが「00:09」に進んでいることを検証
    await page.waitForTimeout(1500)
    await checkTimer('00', '09')
    // タイマーをストップする
    await page.click('#button_stop')
    // タイマーが「00:09」のまま止まっていることを検証
    await page.waitForTimeout(1500)
    await checkTimer('00', '09')
    // タイマーを再スタートする
    await expect(await page.$eval('#button_start', el => el.disabled)).toBe(false)
    await page.click('#button_start')
    // タイマーが「00:08」に進んでいることを検証
    await page.waitForTimeout(1500)
    await checkTimer('00', '08')
  })

  test('ユーザーは、カウントダウンタイマーが動いているとき、タイマーをリセットできないこと', async () => {
    // タイマーを「01:00」に設定
    await setTimer('1', '0')
    // タイマーをスタートする
    await page.click('#button_start')
    // リセットボタンが押せないことを検証
    await expect(await page.$eval('#button_reset', el => el.disabled)).toBe(true)
  })

  test('ユーザーは、カウントダウンタイマーが止まっているとき、タイマーをリセットできること', async () => {
    // タイマーを「01:00」に設定
    await setTimer('1', '0')
    // タイマーを一度もスタートしていないとき、リセットできないことを検証
    await expect(await page.$eval('#button_reset', el => el.disabled)).toBe(true)
    // タイマーをスタートする
    await page.click('#button_start')
    // タイマーをストップする
    await page.waitForTimeout(1500)
    await page.click('#button_stop')
    // タイマーをリセットできることを検証
    await checkTimer('00', '59')
    await page.click('#button_reset')
    await checkTimer('01', '00')
  })

  test('ユーザーは、タイマーを再スタートしたあとでも、正しくタイマーをリセットできること', async () => {
    // タイマーを「01:00」に設定
    await input('#minute', '1')
    // タイマーをスタートする
    await page.click('#button_start')
    // タイマーをストップする
    await page.waitForTimeout(1500)
    await page.click('#button_stop')
    // タイマーを再スタートする
    await page.click('#button_start')
    // タイマーをストップする
    await page.waitForTimeout(1500)
    await page.click('#button_stop')
    // タイマーをリセットできることを検証
    await checkTimer('00', '58')
    await page.click('#button_reset')
    await checkTimer('01', '00')
  })

  test('ユーザーは、カウントダウンが終わったあと、タイマーをリセットできること', async () => {
    // タイマーを「00:01」に設定
    await setTimer('0', '1')
    // タイマースタート
    await page.click('#button_start')
    // タイマーが終了したあとに、タイマーをリセットできることを検証
    await page.waitForTimeout(1500)
    await checkTimer('00', '00')
    await expect(await page.$eval('#button_start', el => el.disabled)).toBe(true)
    await expect(await page.$eval('#button_reset', el => el.disabled)).toBe(false)
    await page.click('#button_reset')
    await checkTimer('00', '01')
    await expect(await page.$eval('#button_start', el => el.disabled)).toBe(false)
    await expect(await page.$eval('#button_reset', el => el.disabled)).toBe(true)
  })

  test('カウントダウンタイマーのカウントダウンがおわったとき、カウントダウンがストップすること', async () => {
    // タイマーを「00:01」に設定
    await input('#second', '1')
    // タイマーをスタート
    await page.click('#button_start')
    // 2000ms待つ
    await page.waitForTimeout(2000)
    // タイマーが「00:00」でストップしていることを検証
    await checkTimer('00', '00')
  })

  test('ユーザーは、カウントダウンタイマーが動いている間、タイマータイプを変更できないこと', async () => {
    // タイマータイプを変更可能であることを検証
    await expect(await page.$eval('#timer_type', el => el.disabled)).toBe(false)
    // タイマーを「01:10」に設定する
    await setTimer('01', '10')
    // スタートボタンを押す
    await page.click('#button_start')
    // タイマータイプを変更できないことを検証
    await expect(await page.$eval('#timer_type', el => el.disabled)).toBe(true)    
  })

})
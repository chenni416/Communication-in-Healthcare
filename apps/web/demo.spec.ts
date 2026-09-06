import { test, expect } from '@playwright/test';

const ROLE_MAP = {
  'P001': '本人',
  'cg_xiaofang': '照護者',
  'nurse_lin': '護理師',
  'dr_wu': '醫師',
  'fam_P001': '家屬'
};

/** 注入紅點虛擬游標與平滑捲動 (DEMO 錄影專用) */
async function injectDemoCursor(page) {
  await page.addInitScript(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    
    const cursor = document.createElement('div');
    cursor.id = 'playwright-demo-cursor';
    cursor.style.width = '32px';
    cursor.style.height = '32px';
    cursor.style.borderRadius = '50%';
    cursor.style.backgroundColor = 'rgba(255, 59, 48, 0.4)';
    cursor.style.border = '2px solid rgba(255, 59, 48, 0.9)';
    cursor.style.position = 'fixed';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '999999';
    cursor.style.transition = 'left 0.4s ease-out, top 0.4s ease-out, transform 0.15s ease';
    cursor.style.transform = 'translate(-50%, -50%)';
    cursor.style.left = '-100px';
    cursor.style.top = '-100px';
    document.documentElement.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    document.addEventListener('mousedown', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(0.6)';
      cursor.style.backgroundColor = 'rgba(255, 59, 48, 0.8)';
    });
    document.addEventListener('mouseup', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.backgroundColor = 'rgba(255, 59, 48, 0.4)';
    });
  });
}

async function humanHover(page, locator) {
  await locator.scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(400); 
  await locator.hover({ force: true }).catch(() => {});
  await page.waitForTimeout(700); 
}

async function humanClick(page, locator) {
  await humanHover(page, locator);
  await locator.click({ force: true }).catch(() => {});
  await page.waitForTimeout(600);
}

async function humanFill(page, locator, text) {
  await humanHover(page, locator);
  await locator.fill(text).catch(() => {});
  await page.waitForTimeout(500);
}

async function loginAsRole(page, identityKey, password = '1940') {
  await page.goto('http://localhost:3000');
  
  const roleBtn = page.getByRole('button', { name: ROLE_MAP[identityKey], exact: true });
  await humanClick(page, roleBtn);
  
  const identitySelect = page.locator('select[name="who"]');
  await humanHover(page, identitySelect);
  await identitySelect.selectOption(identityKey).catch(() => {});
  
  const passInput = page.locator('input[name="code"]');
  await humanFill(page, passInput, password);
  
  const responsePromise = page.waitForResponse(r => r.url().includes('/login') && r.request().method() === 'POST').catch(() => {});
  const enterBtn = page.getByRole('button', { name: /進入/ });
  await humanClick(page, enterBtn);
  
  await responsePromise;
  await page.waitForTimeout(2000); 
}

test.describe('OMNI-TWIN 系統全面 DEMO 錄影 (視覺游標 + 平滑捲動展示)', () => {

  test.beforeEach(async ({ page }) => {
    await injectDemoCursor(page);
  });

  test('Scene 1: 本人端 (長者) - 語音優先與數位分身', async ({ page }) => {
    await loginAsRole(page, 'P001');
    await page.goto('http://localhost:3000/me');
    // 進入 /me 首頁
    await humanClick(page, page.getByRole('button', { name: '進入' }));
    await page.waitForResponse(r => r.url().includes('/api/auth') || r.url().includes('/login') || r.status() === 200).catch(() => {});
    await page.waitForTimeout(2000);

    // 展示：視覺化技術透視 (TechTag)
    const techTag = page.locator('.tech-tag-wrap').first();
    if (await techTag.isVisible()) {
      await humanHover(page, techTag);
      await page.waitForTimeout(2000); // 讓觀眾閱讀 TechTag 內容
    }

    // 展示：第一輪 RAG 語音提問
    const askInput = page.getByPlaceholder(/問我關於健康紀錄的問題/).first();
    if (await askInput.isVisible()) {
      await humanFill(page, askInput, '我最近是不是常常跌倒？');
      await humanClick(page, page.getByRole('button', { name: '送出' }));
      await page.waitForTimeout(5000); // 等待 RAG 檢索與串流生成

      // 展示：點擊 AI 思考軌跡 (Agent Trace) 與來源文獻 (Source)
      const sourceBtn = page.getByRole('button', { name: /來源/ }).first();
      if (await sourceBtn.isVisible()) {
        await humanClick(page, sourceBtn);
        await page.waitForTimeout(2000);
      }
      
      const traceBtn = page.getByRole('button', { name: /花了/ }).first();
      if (await traceBtn.isVisible()) {
        await humanClick(page, traceBtn);
        await page.waitForTimeout(3000);
      }

      // 展示：第二輪 RAG 提問 (展現記憶與多輪)
      await humanFill(page, askInput, '那我昨天的血壓量起來正常嗎？');
      await humanClick(page, page.getByRole('button', { name: '送出' }));
      await page.waitForTimeout(5000); // 等待回答
    }

    // 展示：長者無障礙語音播報 (TTS)
    const ttsBtn = page.locator('button[aria-pressed]').first(); // 語音播放按鈕
    if (await ttsBtn.isVisible()) {
      await humanClick(page, ttsBtn);
      await page.waitForTimeout(3000);
    }
  });

  test('Scene 2: 活體數位孿生 (/twin) - 3D 身體視圖與沙盤推演', async ({ page }) => {
    await loginAsRole(page, 'P001');
    await page.goto('http://localhost:3000/twin');
    
    const title = page.locator('text=我的專屬健康分身').first();
    await title.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await title.isVisible()) await humanHover(page, title);

    // 展示：技術透視標籤 (WebGL)
    const techTag = page.locator('.tech-tag-wrap').first();
    if (await techTag.isVisible()) {
      await humanHover(page, techTag);
      await page.waitForTimeout(1500); 
    }

    const sandboxCheck = page.locator('input[type="checkbox"]').first();
    if (await sandboxCheck.isVisible()) {
      await humanClick(page, sandboxCheck);
      await page.waitForTimeout(2000); 
    }
  });

  test('Scene 3: 照護員端 - 異常置頂與多輪語音通報', async ({ page }) => {
    await loginAsRole(page, 'cg_xiaofang');
    await page.goto('http://localhost:3000/caregiver');

    const redBanner = page.locator('text=王伯 浴室差點滑倒').first();
    await redBanner.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await redBanner.isVisible()) await humanHover(page, redBanner);

    const reportBtn = page.getByRole('button', { name: '語音文字通報' }).first();
    if (await reportBtn.isVisible()) {
      await humanClick(page, reportBtn);
      await page.waitForTimeout(2000); 
    }

    // 展示：技術透視標籤 (LangGraph Intake Agent)
    const agentTag = page.locator('.tech-tag-wrap').first();
    if (await agentTag.isVisible()) {
      await humanHover(page, agentTag);
      await page.waitForTimeout(2000); 
    }

    const sayInput = page.locator('input[name="say"]');
    if (await sayInput.isVisible()) {
      // 第一輪：通報初步狀況
      await humanFill(page, sayInput, '護理師，王伯剛才在浴室差點滑倒，我看他走路很不穩。');
      await humanClick(page, page.getByRole('button', { name: '送出' }));
      await page.waitForTimeout(4000); // 等待 Agent 思考與追問

      // 第二輪：補充細節 (針對受傷與症狀)
      await humanFill(page, sayInput, '他沒有撞到頭，但跟我說覺得有點頭暈，而且一直冒冷汗。');
      await humanClick(page, page.getByRole('button', { name: '送出' }));
      await page.waitForTimeout(4000); 

      // 第三輪：補充時間點與量測數據
      await humanFill(page, sayInput, '大概今天早上開始就不太舒服，剛剛幫他量血壓發現偏低。');
      await humanClick(page, page.getByRole('button', { name: '送出' }));
      await page.waitForTimeout(4000); 

      // 第四輪：總結處置並請 Agent 整理
      await humanFill(page, sayInput, '他現在意識清楚，我已經先扶他到床上休息了，麻煩幫我通報。');
      await humanClick(page, page.getByRole('button', { name: '送出' }));
      await page.waitForTimeout(4500); // 等待 Agent 最終統整並觸發 8 面向
    }

    const dimensionBtn = page.getByRole('button', { name: /把你說的分成八個面向/ }).first();
    if (await dimensionBtn.isVisible()) {
      await humanClick(page, dimensionBtn);
      await page.waitForTimeout(3000); 
    }
  });

  test('Scene 4: 護理師端 - ISBAR 編修與巡診基線更新', async ({ page }) => {
    await loginAsRole(page, 'nurse_lin');
    await page.goto('http://localhost:3000/nurse');

    // 展示：技術透視標籤 (Nurse Assist Agent)
    const nurseAgentTag = page.locator('.tech-tag-wrap').filter({ hasText: 'Nurse Assist' }).first();
    if (await nurseAgentTag.isVisible()) {
      await humanHover(page, nurseAgentTag);
      await page.waitForTimeout(2000); 
    }

    const startBtn = page.getByRole('button', { name: /展開審核/ }).first();
    await startBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await startBtn.isVisible()) {
      await humanClick(page, startBtn);
      await page.waitForTimeout(1000); 
    }
    
    const btnConfirm = page.getByRole('button', { name: /現場評估完成，確認 ISBAR/ }).first();
    if (await btnConfirm.isVisible()) {
      await humanFill(page, page.locator('input[name="consciousness"]'), '清醒');
      // 刻意只輸入重點關鍵字，展現後續系統與 AI 如何利用這些簡短資訊
      await humanFill(page, page.locator('textarea[name="nurse_assessment"]'), '血壓略低伴隨冒冷汗，屬高跌倒風險');
      await humanFill(page, page.locator('textarea[name="nurse_recommendation"]'), '啟動防跌守則，暫緩下床');
      await humanClick(page, btnConfirm);
      await page.waitForTimeout(2500); 
    }

    const phoneIsbarBtn = page.getByRole('button', { name: /在宅急症模式 B 產通話版 ISBAR/ }).first();
    if (await phoneIsbarBtn.isVisible()) {
      await humanClick(page, phoneIsbarBtn);
      await page.waitForTimeout(3000); 
    }

    const roundLink = page.getByRole('link', { name: /巡診準備/ }).first();
    if (await roundLink.isVisible()) {
      await humanClick(page, roundLink);
      await page.waitForTimeout(2000); 

      // 展示：技術透視標籤 (Scheduling Agent)
      const scheduleTag = page.locator('.tech-tag-wrap').filter({ hasText: 'Scheduling' }).first();
      if (await scheduleTag.isVisible()) {
        await humanHover(page, scheduleTag);
        await page.waitForTimeout(2000); 
      }

      const genRoundBtn = page.getByRole('button', { name: /產生本月名單與 RoundPage/ }).first();
      if (await genRoundBtn.isVisible()) {
        await humanClick(page, genRoundBtn);
        await page.waitForTimeout(2000);
      }
      
      const confirmListBtn = page.getByRole('button', { name: /確認名單，發布 RoundPage 給醫師/ }).first();
      if (await confirmListBtn.isVisible()) {
        await humanClick(page, confirmListBtn);
        await page.waitForTimeout(2000);
      }

      const orderInput = page.getByRole('textbox', { name: /王伯/ }).first();
      if (await orderInput.isVisible()) {
        // 刻意寫極簡短醫囑，展示 AI 如何將其擴寫為詳細的「照護者注意事項」與「基線提案」
        await humanFill(page, orderInput, '加入防跌計畫，密切監測血壓');
        await page.waitForTimeout(1000); 
      }

      // 展示：技術透視標籤 (Baseline Agent)
      const baselineTag = page.locator('.tech-tag-wrap').filter({ hasText: 'Baseline' }).first();
      if (await baselineTag.isVisible()) {
        await humanHover(page, baselineTag);
        await page.waitForTimeout(2000); 
      }

      const submitOrderBtn = page.getByRole('button', { name: /送出醫囑/ }).first();
      if (await submitOrderBtn.isVisible()) {
        await humanClick(page, submitOrderBtn);
        await page.waitForTimeout(3500); // 展示 Baseline 生成的結果
      }

      const confirmBaselineBtn = page.getByRole('button', { name: /確認更新基線/ }).first();
      if (await confirmBaselineBtn.isVisible()) {
        await humanClick(page, confirmBaselineBtn);
        await page.waitForTimeout(2000);
      }
    }
  });

  test('Scene 5: 醫師端 - 完整歷史 Timeline 與 極簡 RoundPage', async ({ page }) => {
    await loginAsRole(page, 'dr_wu');
    await page.goto('http://localhost:3000/doctor');

    // 展示：技術透視標籤 (Familiarization LLM)
    const llmTag = page.locator('.tech-tag-wrap').filter({ hasText: 'Familiarization' }).first();
    if (await llmTag.isVisible()) {
      await humanHover(page, llmTag);
      await page.waitForTimeout(2000); 
    }

    const printBtn = page.getByRole('button', { name: /列印 A4/ }).first();
    await printBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await printBtn.isVisible()) {
      await humanClick(page, printBtn);
      await page.waitForTimeout(2000);
    }
    
    const viewBtn = page.getByRole('link', { name: /Timeline/ }).first();
    if (await viewBtn.isVisible()) {
      await humanClick(page, viewBtn);
      await page.waitForTimeout(3000);
    }
  });

  test('Scene 6: 家屬端 - 醫病溝通降維翻譯', async ({ page }) => {
    await loginAsRole(page, 'fam_P001');
    await page.goto('http://localhost:3000/me/timeline');
    
    // 展示：技術透視標籤 (Translation LLM)
    const translateTag = page.locator('.tech-tag-wrap').filter({ hasText: 'Translation' }).first();
    if (await translateTag.isVisible()) {
      await humanHover(page, translateTag);
      await page.waitForTimeout(2000); 
    }

    const toggle = page.getByRole('switch').first();
    await toggle.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await toggle.isVisible()) {
      await humanClick(page, toggle);
      await page.waitForTimeout(3000);
    }

    const contactBtn = page.getByRole('button', { name: /聯絡照護團隊/ }).first();
    if (await contactBtn.isVisible()) {
      await humanClick(page, contactBtn);
      await page.waitForTimeout(2000);
    }
  });
});


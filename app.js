const official = {
  newStudents: 'https://mckinley.illinois.edu/especially/new-students',
  appointments: 'https://mckinley.illinois.edu/get-healthcare/appointments',
  portal: 'https://mymckinley.illinois.edu/',
  healthFee: 'https://mckinley.illinois.edu/fees/health-service-fee',
  insuranceFaq: 'https://si.illinois.edu/faqs/faq-basics',
  insuranceContact: 'https://si.illinois.edu/about',
  glossary: 'https://si.illinois.edu/glossary',
  emergency: 'https://mckinley.illinois.edu/emergency',
  dialNurse: 'https://mckinley.illinois.edu/get-healthcare/dial-nurse',
  referral: 'https://mckinley.illinois.edu/get-healthcare/referral-services'
};

const REVIEW_DATE_ZH = '2026 年 11 月 8 日';
const REVIEW_DATE_EN = 'November 8, 2026';
const REVIEW_DATE_ISO = '2026-11-08';

const copy = {
  zh: {
    top: '为 UIUC 留学生设计的独立导航指南',
    topRight: '官方信息已核对 · ' + REVIEW_DATE_ZH,
    nav: ['从这里开始', '看懂费用', '预约就诊', '术语与清单', '官方资源'],
    emergency: '紧急情况：拨打 911',
    eyebrow: 'FIRST VISIT, MADE CLEARER',
    heroTitle: '在美国第一次看病，<em>先知道下一步。</em>',
    heroText: '从“该找谁”到“电话里怎么说”，一步一步带你找到 UIUC 的正确入口。中英对照，并保留看病时会听到的英文词。',
    startButton: '开始了解流程',
    appointmentButton: '我想预约',
    heroNote: '本指南不属于 UIUC，也不提供诊断或个人保险承诺。',
    cardLabel: 'YOUR ROUTE / 你的路线',
    cardTitle: '从不确定，到有准备',
    cardSteps: ['认识 McKinley', '弄清费用与保险', '预约并准备就诊'],
    floatMain: '一步一步就好',
    floatSub: 'You do not need to know it all at once',
    emergencyTitle: '紧急与危机：先看这里',
    emergencyLead: '本网站不判断症状，也不替代专业医疗建议。若情况危急，请立刻求助。',
    emergencyItems: [
      ['生命危险或医疗紧急', '拨打 <a href="tel:911">911</a>。'],
      ['本地急诊室（Emergency Room）', 'Carle Foundation Hospital，611 W. Park St., Urbana, IL 61801；OSF HealthCare Heart of Mary Medical Center，1400 W. Park St., Urbana, IL 61801。'],
      ['自杀或情绪危机', '拨打 <a href="tel:988">988</a>（National Suicide &amp; Crisis Lifeline）；或 Rosecrance Crisis Line <a href="tel:+18157204953">815-720-4953</a>。'],
      ['不确定是否紧急', '可拨打 Dial-A-Nurse（24/7）<a href="tel:+12173332700">217-333-2700</a>，向医护人员咨询。']
    ],
    emergencyOfficial: '查看 McKinley 官方紧急信息',
    emergencyDialNurse: 'Dial-A-Nurse 说明',
    emergencyDisclaimer: '本站不评估症状，也不决定你该去急诊、Urgent Care 还是预约门诊。',
    chooseKicker: 'START WHERE YOU ARE',
    chooseTitle: '现在，你最需要解决什么？',
    chooseSub: '选择一个入口即可。你也可以按顺序走完整个流程。',
    choices: [
      ['✳', '我还不知道该去哪', '先弄清校园医疗如何运作。', '#journey'],
      ['↗', '我想预约看病', '找到官方预约入口和电话。', '#appointment'],
      ['Aa', '我听不懂这些词', '用简单例子理解常见术语。', '#terms'],
      ['☑', '我快要去就诊了', '准备好就诊前要带的东西。', '#checklist']
    ],
    decisionTitle: '先分清两个地方',
    decisionText: 'McKinley Health Center 处理校园就诊与预约；Student Health Insurance 办公室回答保险、保障范围和费用相关问题。',
    decisionLink: '看懂两者区别 →',
    journeyKicker: 'THE PATH',
    journeyTitle: '第一次就诊，可以这样走。',
    journeyText: '这是一条常见的非紧急就医路径。每一步都能直接跳到官方页面确认。',
    journeyButton: '直接去预约 →',
    diagramTitle: '四步概览',
    diagramSteps: [
      '判断是否紧急（911 / ER / Dial-A-Nurse）',
      '认识 McKinley 与 Primary Care Provider（初级保健提供者）',
      '分清 Health Service Fee 与 Student Health Insurance',
      '预约并准备（MyMcKinley 或电话）'
    ],
    diagramAlt: '四步路径：1 判断是否紧急；2 认识 McKinley 与初级保健提供者；3 分清校园医疗服务费与学生保险；4 预约并准备就诊。',
    timeline: [
      {
        title: '先判断是否紧急',
        text: '如果是紧急情况，拨打 911。普通的非紧急健康问题，可以先从 McKinley 开始。不确定时，可拨打 Dial-A-Nurse（24/7）217-333-2700。',
        detail: '本网站不判断症状。心理危机可拨打 988 或 Rosecrance Crisis Line 815-720-4953。',
        link: 'McKinley 紧急信息',
        url: official.emergency
      },
      {
        title: '认识你的校内医疗入口',
        text: 'McKinley 是 UIUC 的校园健康中心（campus health center）。学生入学后会被分配一位 Primary Care Provider（初级保健提供者）。',
        detail: 'Primary care（初级保健）：通常是非紧急健康问题的第一站。',
        link: 'McKinley 新学生指南',
        url: official.newStudents
      },
      {
        title: '确认谁支付、问谁',
        text: 'Health Service Fee（校园医疗服务费）覆盖 McKinley 的很多服务；Student Health Insurance（学生医疗保险）主要用于 McKinley 之外的医疗。具体费用与保障需要按你的情况核实。',
        detail: '校外就医或转诊（referral）前，可以问保险方：是否 in-network（网络内）？是否需要 referral 或 prior approval（事先批准）？我可能承担多少？',
        link: '保险常见问题',
        url: official.insuranceFaq
      },
      {
        title: '预约并准备',
        text: '多数 McKinley 预约可通过 MyMcKinley 在线办理，也可致电 217-333-2700。记下症状、正在使用的药物和想问的问题。',
        detail: '到达 McKinley 后可使用自助或手机签到（self check-in / mobile check-in）；以你的预约通知为准。',
        link: '官方预约页面',
        url: official.appointments
      }
    ],
    journeySourceLabel: '来源',
    journeySources: 'McKinley New Students · Emergency · Dial-A-Nurse · Appointments',
    compareKicker: 'ONE IMPORTANT DIFFERENCE',
    compareTitle: 'Health Service Fee ≠ Student Health Insurance',
    compareSub: '两项费用用途不同。看懂这点，再决定下一步联系谁。',
    feeTitle: '校园医疗服务费（Health Service Fee）',
    feeText: 'Health Service Fee 支持 McKinley 与 Counseling Center 的多数校内服务。某些检查、疫苗、处方等仍可能收费。',
    feeBullets: [
      '用于许多 McKinley 校内服务',
      '不能支付 McKinley 之外的就诊或转诊（referral）费用',
      'McKinley 不接受健康保险，也不直接向保险公司结算；可索取 Billing Statement（账单明细）自行向保险公司申请报销'
    ],
    feeLink: '查看 McKinley 费用说明 ↗',
    insuranceTitle: '学生医疗保险（Student Health Insurance）',
    insuranceText: 'Student Health Insurance 是与 McKinley 分开的保险安排，主要处理校外医疗的保障与账单。',
    insuranceBullets: [
      '向保险办公室核实保障、in-network（网络内）医生和费用',
      '校外就诊前询问是否需要 referral（转诊）或 prior approval（事先批准）',
      '保险卡、账单和报销问题联系保险办公室'
    ],
    insuranceLink: '查看保险 FAQ ↗',
    insuranceCallout: '<strong>不要假设“有保险”就一定免费。</strong> 就诊地点、保险网络、服务种类和个人计划都会影响费用；请在就诊前向诊所和保险方确认。',
    referralTitle: '关于转诊（Referral）',
    referralText: '若 McKinley 的医护人员建议你去校外专科，Referral Specialist（转诊专员）可协助查找 in-network 提供者并完成相关表格。校外就医前，仍应向 Student Health Insurance 确认是否需要转诊文件或事先批准。',
    referralLink: 'McKinley 转诊服务说明 ↗',
    insuranceContactTitle: '联系 Student Health Insurance 办公室',
    insuranceContactItems: [
      '电话：<a href="tel:+12173009000">217-300-9000</a> 或 <a href="tel:+12173330165">217-333-0165</a>',
      '邮箱：<a href="mailto:insure@illinois.edu">insure@illinois.edu</a>（请使用学生 @illinois.edu 邮箱）',
      '时间：周一至周五 8:00–16:30'
    ],
    insuranceSourceLabel: '来源',
    insuranceSources: 'Health Service Fee · FAQ Basics · About Student Insurance · Referral Services',
    appointmentKicker: 'TAKE THE NEXT STEP',
    appointmentTitle: '找到入口，开始预约。',
    appointmentSub: '下面是 McKinley 的官方预约方式；本站不会代你发送预约。',
    onlineNumber: '01 / ONLINE',
    onlineTitle: '在线预约（MyMcKinley）',
    onlineText: '使用 NetID 登录 MyMcKinley。官方说明称，多数医疗门诊预约可以在线完成。',
    onlineButton: '打开 MyMcKinley ↗',
    onlineHelp: '如果看不到合适时间或服务，请改用电话询问。',
    phoneNumber: '02 / PHONE',
    phoneTitle: '电话预约',
    phoneText: 'McKinley 预约电话；官方页面列出的接听时间为周一至周五 8:00–17:00。',
    phoneButton: '拨打电话',
    phoneHelp: '电话：217-333-2700',
    cancelNote: '取消预约须至少提前 2 小时。未按时取消可能导致 $20 费用记入学生账户（以 McKinley 官方预约页为准）。',
    promptTitle: '不知道电话里怎么说？',
    promptSub: '可以照着读，再按自己的实际情况修改。',
    promptText: 'Hello, I’m a UIUC student. I would like to make an appointment for a non-emergency health concern. Could you tell me the next available time and what I should bring?',
    promptNote: '如果需要对方放慢语速： “Could you please speak more slowly or explain that term?”',
    copyButton: '复制英文话术',
    copied: '已复制',
    appointmentSourceLabel: '来源',
    appointmentSources: 'Appointments · MyMcKinley',
    toolsKicker: 'AT YOUR OWN PACE',
    toolsTitle: '看懂术语，带齐东西。',
    toolsSub: '只保留就诊前最常用的帮助；需要更多解释时再展开。',
    termsTitle: '常见词，放在具体场景里',
    termsText: '输入英文或中文查找。点击词条查看简单解释、示例和可以问的问题。',
    searchPlaceholder: '搜索 copay、转诊、in-network…',
    noTerms: '没有匹配结果。可以咨询保险办公室或查看官方术语表。',
    askLabel: '你可以问：',
    exampleLabel: '示例（非你的个人计划）：',
    terms: [
      {
        word: 'Primary care',
        cn: '初级保健',
        meaning: '非紧急健康问题常见的第一站。UIUC 学生入学后会被分配 McKinley 的 Primary Care Provider（初级保健提供者）。',
        example: '',
        question: 'Can I see my assigned primary care provider?'
      },
      {
        word: 'Referral',
        cn: '转诊',
        meaning: '一位医疗人员建议你去另一位医生或专科。校外就医前，向保险方确认是否需要转诊文件。',
        example: '',
        question: 'Do I need a referral for this visit?'
      },
      {
        word: 'In-network',
        cn: '保险网络内',
        meaning: '与你的保险计划有合作关系的医疗提供者。网络内与网络外的自付费用可能不同。',
        example: '',
        question: 'Is this provider in-network for my plan?'
      },
      {
        word: 'Copay',
        cn: '定额自付（挂号式固定自付）',
        meaning: '某些受保服务由你支付的固定金额，具体按计划和服务类型而定。',
        example: '例如，某次受保门诊的 copay 可能是 $15——这只是说明“固定金额”的概念，不是你的计划金额。',
        question: 'Will I have a copay for this visit?'
      },
      {
        word: 'Deductible',
        cn: '免赔额',
        meaning: '保险开始按计划分担某些费用前，你可能需要先支付的金额。',
        example: '例如，账单 $600、deductible $250 时，你可能先支付 $250，剩余部分再按计划计算——仅为说明概念。',
        question: 'Does my deductible apply to this service?'
      },
      {
        word: 'Coinsurance',
        cn: '按比例自付',
        meaning: '某些受保服务由你按比例承担的费用。比例与计算方式以你的计划为准。',
        example: '例如，允许金额 $100、coinsurance 20% 且 deductible 已满足时，你可能支付 $20——仅为说明概念。',
        question: 'What is my coinsurance for this service?'
      }
    ],
    checklistTitle: '就诊前的简短清单',
    checklistText: '勾选你已经准备好的项目。这个清单只保存在你当前的浏览器里。',
    checklist: [
      '确认预约时间、地点与签到方式（check-in）',
      '带学生证或带照片的身份证件（photo ID）',
      '如在校外就医，准备保险卡（insurance card）或保险信息',
      '列出目前服用的药物、过敏情况和想问的问题',
      '确认是否有需要携带的记录或表格',
      '想好如何询问检查结果与后续安排（follow-up）'
    ],
    checklistProgress: '项已准备',
    checklistReset: '清空清单',
    checklistFoot: '清单仅供准备参考；以诊所给你的具体要求为准。',
    toolsSourceLabel: '来源',
    toolsSources: 'Student Insurance Glossary · Appointments',
    sourcesKicker: 'OFFICIAL DESTINATIONS',
    sourcesTitle: '需要确认时，回到官方来源。',
    sourcesSub: '流程和费用可能变化。以下链接直接通往 UIUC 的相关页面。',
    sources: [
      ['McKinley', '新学生指南', '校内健康中心、初级保健与基本预约信息', official.newStudents],
      ['McKinley', '预约与取消', '预约电话、线上入口与预约规则', official.appointments],
      ['McKinley', 'Health Service Fee', '校内费用包含及未包含的服务', official.healthFee],
      ['McKinley', '紧急信息', '911、本地急诊与危机热线', official.emergency],
      ['McKinley', 'Dial-A-Nurse', '24/7 电话健康咨询', official.dialNurse],
      ['McKinley', '转诊服务', '校外转诊协助说明', official.referral],
      ['Student Insurance', '保险 FAQ', '学生保险与 McKinley 的区别', official.insuranceFaq],
      ['Student Insurance', '联系保险办公室', '保障、参保与账单相关问题', official.insuranceContact],
      ['Student Insurance', '官方术语表', '核对保险词汇的原始解释', official.glossary]
    ],
    sourceAction: '打开官方页面 ↗',
    sourceNote: '官方页面核对日期：' + REVIEW_DATE_ZH + '。本站为学生项目原型，非 UIUC 官方服务；后续仍需用户测试和内容复核。',
    footerText: '让 UIUC 留学生第一次在美国看病时，能更清楚地找到下一步。',
    footerNav: '网站导航',
    footerHelp: '需要真人帮助？',
    footerHelpText: '预约找 McKinley；保险问题找 Student Health Insurance 办公室。',
    footerBottom: '独立学生项目 · 信息导航，不提供医疗建议。',
    footerDate: '内容核对：' + REVIEW_DATE_ISO
  },
  en: {
    top: 'An independent guide for UIUC international students',
    topRight: 'Official pages checked · ' + REVIEW_DATE_EN,
    nav: ['Start here', 'Fees & insurance', 'Book a visit', 'Terms & checklist', 'Official resources'],
    emergency: 'Emergency: call 911',
    eyebrow: 'FIRST VISIT, MADE CLEARER',
    heroTitle: 'Your first doctor’s visit in the U.S. <em>Start with the next step.</em>',
    heroText: 'From “Who do I contact?” to “What do I say on the phone?”—a clear route to the right UIUC resource, with useful terms in English and Chinese.',
    startButton: 'See the steps',
    appointmentButton: 'I want to book',
    heroNote: 'This independent guide is not affiliated with UIUC and does not give diagnoses or coverage guarantees.',
    cardLabel: 'YOUR ROUTE',
    cardTitle: 'From unsure to prepared',
    cardSteps: ['Know McKinley', 'Check fees & insurance', 'Book and get ready'],
    floatMain: 'One step at a time',
    floatSub: 'You do not need to know it all at once',
    emergencyTitle: 'Emergency and crisis: start here',
    emergencyLead: 'This site does not assess symptoms and is not a substitute for professional medical advice. If you are in danger, get help now.',
    emergencyItems: [
      ['Life-threatening or medical emergency', 'Call <a href="tel:911">911</a>.'],
      ['Local emergency rooms', 'Carle Foundation Hospital, 611 W. Park St., Urbana, IL 61801; OSF HealthCare Heart of Mary Medical Center, 1400 W. Park St., Urbana, IL 61801.'],
      ['Suicide or emotional crisis', 'Call <a href="tel:988">988</a> (National Suicide &amp; Crisis Lifeline), or the Rosecrance Crisis Line at <a href="tel:+18157204953">815-720-4953</a>.'],
      ['Not sure if it is urgent', 'Call Dial-A-Nurse (24/7) at <a href="tel:+12173332700">217-333-2700</a> to speak with a healthcare professional.']
    ],
    emergencyOfficial: 'Official McKinley emergency information',
    emergencyDialNurse: 'Dial-A-Nurse details',
    emergencyDisclaimer: 'This site does not assess symptoms and does not decide whether you should go to an ER, urgent care, or a scheduled visit.',
    chooseKicker: 'START WHERE YOU ARE',
    chooseTitle: 'What do you need help with right now?',
    chooseSub: 'Pick one starting point, or follow the whole path in order.',
    choices: [
      ['✳', 'I don’t know where to go', 'Understand how campus care works.', '#journey'],
      ['↗', 'I want an appointment', 'Find the official portal and phone number.', '#appointment'],
      ['Aa', 'I need help with terms', 'Understand common words with examples.', '#terms'],
      ['☑', 'My visit is coming up', 'Get ready with a short checklist.', '#checklist']
    ],
    decisionTitle: 'Two places, different roles',
    decisionText: 'McKinley Health Center handles campus care and appointments. The Student Health Insurance office answers questions about coverage, benefits, and insurance costs.',
    decisionLink: 'Understand the difference →',
    journeyKicker: 'THE PATH',
    journeyTitle: 'A practical route for your first visit.',
    journeyText: 'This is a common route for non-emergency care. Check each step on the official pages.',
    journeyButton: 'Go to booking →',
    diagramTitle: 'Four-step overview',
    diagramSteps: [
      'Check for an emergency (911 / ER / Dial-A-Nurse)',
      'Know McKinley and your Primary Care Provider',
      'Separate the Health Service Fee from Student Health Insurance',
      'Book and prepare (MyMcKinley or phone)'
    ],
    diagramAlt: 'Four-step path: 1 check for an emergency; 2 know McKinley and primary care; 3 separate campus health fee from student insurance; 4 book and prepare for the visit.',
    timeline: [
      {
        title: 'First, check for an emergency',
        text: 'If it is an emergency, call 911. For ordinary non-emergency concerns, McKinley is a starting point. If you are unsure, call Dial-A-Nurse (24/7) at 217-333-2700.',
        detail: 'This site does not assess symptoms. For a mental-health crisis, call 988 or the Rosecrance Crisis Line at 815-720-4953.',
        link: 'McKinley emergency information',
        url: official.emergency
      },
      {
        title: 'Know your campus care starting point',
        text: 'McKinley is UIUC’s campus health center. Enrolled students are assigned a Primary Care Provider at McKinley.',
        detail: 'Primary care is often the first stop for non-emergency health concerns.',
        link: 'McKinley new student guide',
        url: official.newStudents
      },
      {
        title: 'Check who pays and whom to ask',
        text: 'The Health Service Fee covers many McKinley services. Student Health Insurance mainly covers care outside McKinley. Verify costs and coverage for your situation.',
        detail: 'Before outside care or a referral, ask your insurer: Is this in-network? Do I need a referral or prior approval? What might I owe?',
        link: 'Insurance FAQ',
        url: official.insuranceFaq
      },
      {
        title: 'Book and prepare',
        text: 'Most McKinley appointments can be made through MyMcKinley or by calling 217-333-2700. Note your symptoms, medicines, and questions.',
        detail: 'At McKinley, use self check-in or mobile check-in as directed by your appointment instructions.',
        link: 'Official appointment page',
        url: official.appointments
      }
    ],
    journeySourceLabel: 'Source',
    journeySources: 'McKinley New Students · Emergency · Dial-A-Nurse · Appointments',
    compareKicker: 'ONE IMPORTANT DIFFERENCE',
    compareTitle: 'Health Service Fee ≠ Student Health Insurance',
    compareSub: 'These cover different things. Knowing which is which helps you contact the right office.',
    feeTitle: 'Campus Health Service Fee',
    feeText: 'The Health Service Fee supports many services at McKinley and the Counseling Center. Some tests, immunizations, and prescriptions may still have charges.',
    feeBullets: [
      'Supports many services at McKinley',
      'Does not pay for care outside McKinley, including referrals',
      'McKinley does not accept health insurance and does not bill insurers directly; you can request a Billing Statement to submit for possible reimbursement'
    ],
    feeLink: 'McKinley fee information ↗',
    insuranceTitle: 'Student Health Insurance',
    insuranceText: 'Student Health Insurance is separate from McKinley and mainly addresses coverage and bills for care outside McKinley.',
    insuranceBullets: [
      'Ask about benefits, in-network care, and costs',
      'Before outside care, ask about referrals or prior approval',
      'Contact the insurance office about cards, bills, and claims'
    ],
    insuranceLink: 'Insurance FAQ ↗',
    insuranceCallout: '<strong>Having insurance does not mean every visit is free.</strong> Cost depends on the care site, network, service, and your plan. Confirm with the clinic and insurer before a visit.',
    referralTitle: 'About referrals',
    referralText: 'If a McKinley clinician recommends outside specialty care, a Referral Specialist can help identify in-network providers and complete forms. Before outside care, still confirm with Student Health Insurance whether a referral or prior approval is required.',
    referralLink: 'McKinley referral services ↗',
    insuranceContactTitle: 'Contact the Student Health Insurance office',
    insuranceContactItems: [
      'Phone: <a href="tel:+12173009000">217-300-9000</a> or <a href="tel:+12173330165">217-333-0165</a>',
      'Email: <a href="mailto:insure@illinois.edu">insure@illinois.edu</a> (use your student @illinois.edu address)',
      'Hours: Monday–Friday, 8:00 a.m.–4:30 p.m.'
    ],
    insuranceSourceLabel: 'Source',
    insuranceSources: 'Health Service Fee · FAQ Basics · About Student Insurance · Referral Services',
    appointmentKicker: 'TAKE THE NEXT STEP',
    appointmentTitle: 'Find the route to book.',
    appointmentSub: 'These are McKinley’s official booking options. This site does not send an appointment request for you.',
    onlineNumber: '01 / ONLINE',
    onlineTitle: 'Book online (MyMcKinley)',
    onlineText: 'Sign in to MyMcKinley with your NetID. McKinley says most medical clinic appointments can be booked online.',
    onlineButton: 'Open MyMcKinley ↗',
    onlineHelp: 'If you cannot find the right time or service, call and ask.',
    phoneNumber: '02 / PHONE',
    phoneTitle: 'Book by phone',
    phoneText: 'McKinley’s booking number. The official page lists Monday–Friday, 8:00 a.m.–5:00 p.m. for calls.',
    phoneButton: 'Call now',
    phoneHelp: 'Phone: 217-333-2700',
    cancelNote: 'Cancel at least two hours before your appointment. Missing that window may result in a $20 charge to your student account (per McKinley’s official appointments page).',
    promptTitle: 'Unsure what to say on the phone?',
    promptSub: 'Read this aloud and change it to fit your situation.',
    promptText: 'Hello, I’m a UIUC student. I would like to make an appointment for a non-emergency health concern. Could you tell me the next available time and what I should bring?',
    promptNote: 'If you need a slower explanation: “Could you please speak more slowly or explain that term?”',
    copyButton: 'Copy English script',
    copied: 'Copied',
    appointmentSourceLabel: 'Source',
    appointmentSources: 'Appointments · MyMcKinley',
    toolsKicker: 'AT YOUR OWN PACE',
    toolsTitle: 'Understand terms. Bring what you need.',
    toolsSub: 'Short, optional support for the moments before your visit.',
    termsTitle: 'Common terms, in context',
    termsText: 'Search in English or Chinese. Open a term for a plain explanation, an illustrative example, and a useful question.',
    searchPlaceholder: 'Search copay, referral, in-network…',
    noTerms: 'No matches. Ask the insurance office or check its official glossary.',
    askLabel: 'You can ask:',
    exampleLabel: 'Illustrative example (not your plan):',
    terms: [
      {
        word: 'Primary care',
        cn: '初级保健',
        meaning: 'A common first stop for non-emergency concerns. UIUC students are assigned a McKinley Primary Care Provider when they enroll.',
        example: '',
        question: 'Can I see my assigned primary care provider?'
      },
      {
        word: 'Referral',
        cn: '转诊',
        meaning: 'When one clinician directs you to another provider or specialist. Ask your insurer whether paperwork is needed for outside care.',
        example: '',
        question: 'Do I need a referral for this visit?'
      },
      {
        word: 'In-network',
        cn: '保险网络内',
        meaning: 'A provider with an agreement with your insurance plan. Your share of the cost can differ inside and outside the network.',
        example: '',
        question: 'Is this provider in-network for my plan?'
      },
      {
        word: 'Copay',
        cn: '定额自付',
        meaning: 'A fixed amount you may pay for a covered service. The amount depends on your plan and the service.',
        example: 'For example, a covered office visit might have a $15 copay—this only illustrates a fixed amount, not your plan’s amount.',
        question: 'Will I have a copay for this visit?'
      },
      {
        word: 'Deductible',
        cn: '免赔额',
        meaning: 'An amount you may have to pay before your plan starts sharing the cost of certain services.',
        example: 'For example, on a $600 bill with a $250 deductible, you might pay the first $250 before plan sharing applies—illustrative only.',
        question: 'Does my deductible apply to this service?'
      },
      {
        word: 'Coinsurance',
        cn: '按比例自付',
        meaning: 'A percentage of certain covered costs that you pay. Check the rate and calculation with your plan.',
        example: 'For example, if the allowed amount is $100, coinsurance is 20%, and the deductible is already met, you might pay $20—illustrative only.',
        question: 'What is my coinsurance for this service?'
      }
    ],
    checklistTitle: 'A short pre-visit checklist',
    checklistText: 'Check off what you have ready. The list is saved only in this browser.',
    checklist: [
      'Confirm the appointment time, place, and check-in method',
      'Bring your student ID or photo ID',
      'For outside care, bring your insurance card or details',
      'List medicines, allergies, and questions',
      'Check whether records or forms are required',
      'Ask how you will receive results and follow-up instructions'
    ],
    checklistProgress: 'items ready',
    checklistReset: 'Clear checklist',
    checklistFoot: 'Use this for preparation; follow any specific instructions from your clinic.',
    toolsSourceLabel: 'Source',
    toolsSources: 'Student Insurance Glossary · Appointments',
    sourcesKicker: 'OFFICIAL DESTINATIONS',
    sourcesTitle: 'When in doubt, check the official source.',
    sourcesSub: 'Procedures and costs can change. These links go directly to the relevant UIUC pages.',
    sources: [
      ['McKinley', 'New students', 'Campus health center, primary care, and booking basics', official.newStudents],
      ['McKinley', 'Appointments', 'Booking number, portal, and cancellation rules', official.appointments],
      ['McKinley', 'Health Service Fee', 'What the campus fee does and does not cover', official.healthFee],
      ['McKinley', 'Emergency information', '911, local ERs, and crisis lines', official.emergency],
      ['McKinley', 'Dial-A-Nurse', '24/7 phone health advice', official.dialNurse],
      ['McKinley', 'Referral services', 'Help with outside referrals', official.referral],
      ['Student Insurance', 'Insurance FAQ', 'How insurance differs from McKinley', official.insuranceFaq],
      ['Student Insurance', 'Contact the office', 'Help with coverage, enrollment, and bills', official.insuranceContact],
      ['Student Insurance', 'Official glossary', 'Original definitions for insurance terms', official.glossary]
    ],
    sourceAction: 'Open official page ↗',
    sourceNote: 'Official pages checked ' + REVIEW_DATE_EN + '. This is an independent student project prototype. User testing and professional content review are still needed.',
    footerText: 'A clearer next step for UIUC international students visiting a doctor in the U.S. for the first time.',
    footerNav: 'Explore',
    footerHelp: 'Need a real person?',
    footerHelpText: 'Contact McKinley to book care; contact Student Health Insurance with coverage questions.',
    footerBottom: 'Independent student project · Information guide, not medical advice.',
    footerDate: 'Content checked: ' + REVIEW_DATE_ISO
  }
};

let language = localStorage.getItem('icg-language') === 'en' ? 'en' : 'zh';
const app = document.getElementById('app');
const links = ['#start', '#insurance', '#appointment', '#terms', '#sources'];

function external(url, label, className = 'text-link') {
  return `<a class="${className}" href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
}

function sourceLine(label, text, urls) {
  const linksHtml = urls.map(([name, url]) => external(url, name)).join(' · ');
  return `<p class="source-line"><strong>${label} · Reviewed ${REVIEW_DATE_ISO}</strong> — ${text}. ${linksHtml}</p>`;
}

function render() {
  const t = copy[language];
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.title = language === 'zh'
    ? 'Illinois Care Guide · UIUC 留学生就医导航'
    : 'Illinois Care Guide · Healthcare navigation for UIUC students';

  const colon = language === 'en' ? ':' : '：';
  const emergencyList = t.emergencyItems.map(([title, body]) => `<li><strong>${title}${colon}</strong> ${body}</li>`).join('');

  app.innerHTML = `
    <header class="site-header">
      <div class="topline"><div class="shell"><span>${t.top}</span><span>${t.topRight}</span></div></div>
      <div class="shell header-inner">
        <a class="brand" href="#top" aria-label="Illinois Care Guide home"><span class="brand-mark" aria-hidden="true">✳</span>Illinois Care Guide</a>
        <nav class="desktop-nav" aria-label="Primary navigation">${t.nav.map((n, i) => `<a href="${links[i]}">${n}</a>`).join('')}</nav>
        <div class="header-actions">
          <a class="emergency-link" href="tel:911">${t.emergency}</a>
          <div class="lang-switch" role="group" aria-label="Language / 语言">
            <button type="button" data-lang="zh" class="${language === 'zh' ? 'active' : ''}" aria-pressed="${language === 'zh'}">中文</button>
            <button type="button" data-lang="en" class="${language === 'en' ? 'active' : ''}" aria-pressed="${language === 'en'}">EN</button>
          </div>
          <button class="menu-button" type="button" aria-label="Menu" aria-expanded="false">☰</button>
        </div>
      </div>
      <nav class="mobile-nav" aria-label="Mobile navigation">${t.nav.map((n, i) => `<a href="${links[i]}">${n}</a>`).join('')}<a href="tel:911">${t.emergency}</a></nav>
    </header>
    <main id="main">
      <section class="hero" id="top">
        <div class="shell hero-grid">
          <div class="hero-copy">
            <div class="eyebrow"><span class="dot"></span>${t.eyebrow}</div>
            <h1>${t.heroTitle}</h1>
            <p>${t.heroText}</p>
            <div class="hero-buttons">
              <a class="button button-primary" href="#start">${t.startButton} <span aria-hidden="true">↗</span></a>
              <a class="button button-outline" href="#appointment">${t.appointmentButton}</a>
            </div>
            <div class="hero-note">${t.heroNote}</div>
          </div>
          <div class="hero-visual" aria-hidden="true">
            <div class="orbit"></div><div class="orbit two"></div>
            <div class="route-card">
              <div class="mini-label">${t.cardLabel}</div>
              <div class="route-card-title">${t.cardTitle}</div>
              ${t.cardSteps.map((s, i) => `<div class="route-step"><span class="step-icon">${['✳', '◇', '✓'][i]}</span>${s}<span>0${i + 1}</span></div>`).join('')}
            </div>
            <div class="floating-tag">${t.floatMain}<small>${t.floatSub}</small></div>
          </div>
        </div>
      </section>

      <div class="quick-strip">
        <div class="shell">
          <div class="emergency-panel" role="region" aria-label="${t.emergencyTitle}">
            <h2 class="emergency-heading">${t.emergencyTitle}</h2>
            <p>${t.emergencyLead}</p>
            <ul>${emergencyList}</ul>
            <p class="emergency-note">${t.emergencyDisclaimer}</p>
            <p style="margin:12px 0 0;font-size:12px;">
              ${external(official.emergency, t.emergencyOfficial + ' ↗')}
              &nbsp;·&nbsp;
              ${external(official.dialNurse, t.emergencyDialNurse + ' ↗')}
            </p>
          </div>
        </div>
      </div>

      <section class="section" id="start">
        <div class="shell">
          <div class="section-kicker">${t.chooseKicker}</div>
          <div class="section-head"><div><h2>${t.chooseTitle}</h2><p class="section-sub">${t.chooseSub}</p></div></div>
          <div class="route-grid">${t.choices.map(c => `<a class="choice-card" href="${c[3]}"><span class="choice-icon" aria-hidden="true">${c[0]}</span><h3>${c[1]}</h3><p>${c[2]}</p><span class="choice-arrow" aria-hidden="true">↗</span></a>`).join('')}</div>
          <div class="decision-panel"><strong>${t.decisionTitle}</strong><p>${t.decisionText}</p><a href="#insurance">${t.decisionLink}</a></div>
        </div>
      </section>

      <section class="section journey-section" id="journey">
        <div class="shell journey-layout">
          <div class="journey-intro">
            <div class="section-kicker">${t.journeyKicker}</div>
            <h2>${t.journeyTitle}</h2>
            <p>${t.journeyText}</p>
            <a class="button button-dark" href="#appointment">${t.journeyButton}</a>
          </div>
          <div>
            <div class="path-diagram" role="region" aria-label="${t.diagramTitle}">
              <h3>${t.diagramTitle}</h3>
              <p class="diagram-alt">${t.diagramAlt}</p>
              <ol>${t.diagramSteps.map(s => `<li>${s}</li>`).join('')}</ol>
            </div>
            <div class="timeline">${t.timeline.map((s, i) => `<div class="timeline-item"><div class="timeline-num">0${i + 1}</div><div class="timeline-card"><h3>${s.title}</h3><p>${s.text}</p><div class="detail">${s.detail}</div>${external(s.url, s.link + ' ↗')}</div></div>`).join('')}</div>
            ${sourceLine(t.journeySourceLabel, t.journeySources, [
              ['New students', official.newStudents],
              ['Emergency', official.emergency],
              ['Dial-A-Nurse', official.dialNurse],
              ['Appointments', official.appointments]
            ])}
          </div>
        </div>
      </section>

      <section class="section" id="insurance">
        <div class="shell">
          <div class="section-kicker">${t.compareKicker}</div>
          <div class="section-head"><div><h2>${t.compareTitle}</h2><p class="section-sub">${t.compareSub}</p></div></div>
          <div class="compare-grid">
            <article class="compare-card">
              <div class="compare-top"><span class="compare-icon" aria-hidden="true">✳</span><h3>${t.feeTitle}</h3></div>
              <p>${t.feeText}</p>
              <ul>${t.feeBullets.map(x => `<li>${x}</li>`).join('')}</ul>
              ${external(official.healthFee, t.feeLink)}
            </article>
            <article class="compare-card dark">
              <div class="compare-top"><span class="compare-icon" aria-hidden="true">◇</span><h3>${t.insuranceTitle}</h3></div>
              <p>${t.insuranceText}</p>
              <ul>${t.insuranceBullets.map(x => `<li>${x}</li>`).join('')}</ul>
              ${external(official.insuranceFaq, t.insuranceLink)}
            </article>
          </div>
          <div class="insurance-callout">${t.insuranceCallout}</div>
          <div class="referral-box">
            <strong>${t.referralTitle}</strong>
            <p style="margin:8px 0 10px;">${t.referralText}</p>
            ${external(official.referral, t.referralLink)}
          </div>
          <div class="referral-box" style="background:#fffefa;">
            <strong>${t.insuranceContactTitle}</strong>
            <ul class="contact-list">${t.insuranceContactItems.map(x => `<li>${x}</li>`).join('')}</ul>
            <p style="margin:10px 0 0;">${external(official.insuranceContact, language === 'zh' ? '办公室页面 ↗' : 'Office page ↗')}</p>
          </div>
          ${sourceLine(t.insuranceSourceLabel, t.insuranceSources, [
            ['Health Service Fee', official.healthFee],
            ['FAQ Basics', official.insuranceFaq],
            ['About', official.insuranceContact],
            ['Referral services', official.referral]
          ])}
        </div>
      </section>

      <section class="section appointment-section" id="appointment">
        <div class="shell">
          <div class="section-kicker">${t.appointmentKicker}</div>
          <div class="section-head"><div><h2>${t.appointmentTitle}</h2><p class="section-sub">${t.appointmentSub}</p></div></div>
          <div class="appointment-grid">
            <article class="appointment-card">
              <div class="number">${t.onlineNumber}</div>
              <h3>${t.onlineTitle}</h3>
              <p>${t.onlineText}</p>
              ${external(official.portal, t.onlineButton, 'button button-dark')}
              <div class="helper-row"><span aria-hidden="true">ⓘ</span>${t.onlineHelp}</div>
            </article>
            <article class="appointment-card">
              <div class="number">${t.phoneNumber}</div>
              <h3>${t.phoneTitle}</h3>
              <p>${t.phoneText}</p>
              <a class="phone-big" href="tel:+12173332700">217-333-2700</a>
              <a class="button button-light" href="tel:+12173332700">${t.phoneButton} ↗</a>
              <div class="helper-row"><span aria-hidden="true">ⓘ</span>${t.phoneHelp}</div>
            </article>
          </div>
          <div class="cancel-note">${t.cancelNote} ${external(official.appointments, language === 'zh' ? '官方预约页 ↗' : 'Official appointments page ↗')}</div>
          <div class="prompt-box">
            <div class="prompt-head">
              <div><h3>${t.promptTitle}</h3><p>${t.promptSub}</p></div>
              <button class="copy-btn" type="button" id="copy-script">${t.copyButton}</button>
            </div>
            <p class="script-text" id="script-text" lang="en">“${t.promptText}”</p>
            <p class="script-note">${t.promptNote}</p>
          </div>
          ${sourceLine(t.appointmentSourceLabel, t.appointmentSources, [
            ['Appointments', official.appointments],
            ['MyMcKinley', official.portal]
          ])}
        </div>
      </section>

      <section class="section" id="terms">
        <div class="shell">
          <div class="section-kicker">${t.toolsKicker}</div>
          <div class="section-head"><div><h2>${t.toolsTitle}</h2><p class="section-sub">${t.toolsSub}</p></div></div>
          <div class="tools-grid">
            <div class="tool-card">
              <h3>${t.termsTitle}</h3>
              <p>${t.termsText}</p>
              <div class="search-wrap"><span aria-hidden="true">⌕</span><input id="term-search" type="search" aria-label="Search terms / 搜索术语" placeholder="${t.searchPlaceholder}"></div>
              <div class="term-list" id="term-list">${termsMarkup(t, '')}</div>
              <p class="check-foot">${external(official.glossary, language === 'zh' ? '查看官方完整术语表 ↗' : 'View the official full glossary ↗')}</p>
            </div>
            <div class="tool-card" id="checklist">
              <h3>${t.checklistTitle}</h3>
              <p>${t.checklistText}</p>
              <div id="check-progress-label" class="check-foot" aria-live="polite"></div>
              <div class="check-progress" aria-hidden="true"><span id="check-progress-bar"></span></div>
              <div class="check-list">${t.checklist.map((c, i) => `<label class="check-item"><input type="checkbox" data-check="${i}"><span>${c}</span></label>`).join('')}</div>
              <button class="reset-btn" type="button" id="reset-checklist">${t.checklistReset}</button>
              <div class="check-foot">${t.checklistFoot}</div>
            </div>
          </div>
          ${sourceLine(t.toolsSourceLabel, t.toolsSources, [
            ['Glossary', official.glossary],
            ['Appointments', official.appointments]
          ])}
        </div>
      </section>

      <section class="section sources-section" id="sources">
        <div class="shell">
          <div class="section-kicker">${t.sourcesKicker}</div>
          <div class="section-head"><div><h2>${t.sourcesTitle}</h2><p class="section-sub">${t.sourcesSub}</p></div></div>
          <div class="source-grid">${t.sources.map(s => `<article class="source-card"><small>${s[0]}</small><h3>${s[1]}</h3><p>${s[2]}</p>${external(s[3], t.sourceAction)}</article>`).join('')}</div>
          <p class="source-note">${t.sourceNote}</p>
          ${sourceLine(language === 'zh' ? '来源' : 'Source', language === 'zh' ? '本页汇总官方入口' : 'Official destinations listed on this page', [
            ['Emergency', official.emergency],
            ['Fee', official.healthFee],
            ['FAQ', official.insuranceFaq]
          ])}
        </div>
      </section>
    </main>
    <footer class="footer">
      <div class="shell">
        <div class="footer-grid">
          <div>
            <a class="brand" href="#top"><span class="brand-mark" aria-hidden="true">✳</span>Illinois Care Guide</a>
            <p>${t.footerText}</p>
          </div>
          <div>
            <h3>${t.footerNav}</h3>
            ${t.nav.map((n, i) => `<a href="${links[i]}">${n}</a>`).join('')}
          </div>
          <div>
            <h3>${t.footerHelp}</h3>
            <p>${t.footerHelpText}</p>
            <a href="tel:+12173332700">McKinley · 217-333-2700</a>
            <a href="tel:+12173009000">Student Insurance · 217-300-9000</a>
            ${external(official.insuranceContact, language === 'zh' ? '学生保险办公室页面 ↗' : 'Student Insurance Office page ↗', '')}
            ${external(official.dialNurse, 'Dial-A-Nurse ↗', '')}
          </div>
        </div>
        <div class="footer-bottom"><span>${t.footerBottom}</span><span>${t.footerDate}</span></div>
      </div>
    </footer>`;

  document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => {
    if (button.dataset.lang === language) return;
    const currentHash = location.hash;
    language = button.dataset.lang;
    localStorage.setItem('icg-language', language);
    render();
    if (currentHash) document.querySelector(currentHash)?.scrollIntoView();
  }));

  const menu = document.querySelector('.menu-button');
  menu.addEventListener('click', () => {
    const nav = document.querySelector('.mobile-nav');
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.mobile-nav a').forEach(a => a.addEventListener('click', () => {
    document.querySelector('.mobile-nav').classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  }));

  document.getElementById('term-search').addEventListener('input', e => {
    document.getElementById('term-list').innerHTML = termsMarkup(t, e.target.value);
  });

  document.getElementById('copy-script').addEventListener('click', async e => {
    try {
      await navigator.clipboard.writeText(t.promptText);
      e.target.textContent = t.copied;
      setTimeout(() => { if (e.target.isConnected) e.target.textContent = t.copyButton; }, 2000);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(document.getElementById('script-text'));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });

  const checked = readChecks();
  document.querySelectorAll('[data-check]').forEach(input => {
    input.checked = checked.includes(Number(input.dataset.check));
    input.addEventListener('change', () => { saveChecks(); updateProgress(t); });
  });
  document.getElementById('reset-checklist').addEventListener('click', () => {
    document.querySelectorAll('[data-check]').forEach(i => i.checked = false);
    saveChecks();
    updateProgress(t);
  });
  updateProgress(t);
}

function termsMarkup(t, query) {
  const q = query.trim().toLocaleLowerCase();
  const matching = t.terms.filter(x => `${x.word} ${x.cn} ${x.meaning} ${x.example || ''}`.toLocaleLowerCase().includes(q));
  return matching.length
    ? matching.map(x => {
        const example = x.example ? `<small><strong>${t.exampleLabel}</strong> ${x.example}</small>` : '';
        return `<details class="term"><summary>${x.word} · ${x.cn}</summary><p>${x.meaning}${example}<small>${t.askLabel} <span lang="en">“${x.question}”</span></small></p></details>`;
      }).join('')
    : `<p class="check-foot">${t.noTerms}</p>`;
}

function readChecks() {
  try {
    const a = JSON.parse(localStorage.getItem('icg-checklist') || '[]');
    return Array.isArray(a) ? a : [];
  } catch { return []; }
}
function saveChecks() {
  localStorage.setItem('icg-checklist', JSON.stringify([...document.querySelectorAll('[data-check]:checked')].map(i => Number(i.dataset.check))));
}
function updateProgress(t) {
  const count = document.querySelectorAll('[data-check]:checked').length;
  document.getElementById('check-progress-label').textContent = `${count} / ${t.checklist.length} ${t.checklistProgress}`;
  document.getElementById('check-progress-bar').style.width = `${count / t.checklist.length * 100}%`;
}

render();

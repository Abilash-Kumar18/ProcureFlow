export const translations = {
  en: {
    appTitle: 'ProcureFlow',
    appSubtitle: 'Smart Procurement Centre Queue & Status Platform',
    sihTag: 'SIH 2026 Problem Statement 26032 • Dept of Consumer Affairs',
    govtHeader: 'Department of Consumer Affairs (DoCA) • Ministry of Consumer Affairs, Food & Public Distribution',
    sihBadge: 'SIH 2026 Problem Statement 26032',
    realtimeConnected: 'REAL-TIME SSE CONNECTED (12ms)',
    fallbackSync: 'FALLBACK SYNC',
    zoneTag: 'Thanjavur Agriculture Zone • Kharif KMS 2026',
    footerText: 'ProcureFlow • Smart Procurement Centre Queue & Status Platform',
    footerSubtext: 'Built for Smart India Hackathon 2026 • Ministry of Consumer Affairs, Food & Public Distribution',
    footerTagline: 'Zero Gate Queues • 100% Transparent DBT Payments',
    roles: {
      FARMER: 'Farmer Portal',
      OPERATOR: 'Centre Operator Console',
      DISTRICT_ADMIN: 'District Admin Dashboard'
    },
    demoBar: {
      persona: 'Demo Persona',
      language: 'Language',
      resetData: 'Reset',
      resetting: 'Resetting...',
      liveSync: 'Live Sync',
      connected: 'Connected to Centre Live Stream'
    },
    common: {
      cancel: 'Cancel',
      confirm: 'Confirm',
      close: 'Close',
      done: 'Done',
      print: 'Print Official Slip 🖨️',
      loading: 'Loading...',
      actions: 'Actions',
      records: 'Records',
      optimal: 'Optimal',
      heavyTraffic: 'Heavy Traffic',
      scheduled: 'Scheduled',
      status: 'Status',
      date: 'Date',
      time: 'Time',
      quintals: 'Qtl',
      rupees: '₹'
    },
    farmer: {
      welcome: 'Welcome,',
      farmerRef: 'Farmer ID:',
      verifiedProfile: 'Verified Farmer Profile',
      kharifQuota: 'Kharif 2026 Quota',
      eligiblePaddy: 'Eligible for Grade A Paddy',
      bookNewSlot: 'Book New Procurement Slot',
      activeBookingTitle: 'Your Next Procurement Booking',
      officialDigitalPass: 'OFFICIAL DIGITAL PASS',
      docaNetwork: 'DoCA APMC Network',
      tokenNumber: 'Virtual Token',
      bookingRef: 'REF:',
      procurementDate: 'Procurement Date',
      arrivalWindow: 'Arrival Window',
      cropExpectedVolume: 'Crop / Expected Volume',
      currentStatus: 'Current Status',
      peopleAhead: 'Farmers Ahead of You',
      ahead: 'Ahead',
      estimatedWait: 'Estimated Wait Time',
      arrivalPending: 'Arrival Pending',
      estWaitMinutes: 'Estimated Waiting Time: ~',
      minutes: 'mins',
      tokenIsCalled: 'Your Token is Called!',
      weighingInProgress: 'Weighing in Progress at Bay',
      procurementComplete: 'Procurement Complete',
      arrivalPendingDesc: 'Gate check-in activates your virtual token and assigns your position in the digital queue.',
      dynamicQueueDesc: 'System dynamically adjusts queue order based on actual weighbridge duration.',
      checkInNow: 'I Have Arrived • Check In',
      viewReceipt: 'View Receipt',
      stepper: {
        booked: '1. Booked',
        gateCheckin: '2. Gate Check-in',
        weighbridge: '3. Weighbridge Bay',
        qualityCheck: '4. Quality Check',
        dbtCredit: '5. DBT Credit'
      },
      urgentAlert: {
        title: 'IMMEDIATE ACTION REQUIRED',
        calledTo: '🚨 YOUR TOKEN IS CALLED! Proceed to',
        instructions: 'Please guide your tractor/truck into the assigned bay for weighbridge gross measurement.',
        playChime: 'Play Chime 🔔'
      },
      noActiveBooking: 'No active booking for today.',
      noActiveBookingDesc: 'Reserve your appointment in advance to eliminate waiting at the mandi gate.',
      historyTitle: 'Procurement History & Receipts',
      notifications: 'Recent Alerts & SMS',
      notificationsLive: 'SMS & PUSH LIVE',
      deliveredTo: 'Delivered to',
      bookingModal: {
        title: 'Book New Procurement Slot',
        subtitle: 'Department of Consumer Affairs (DoCA) Procurement Booking',
        step1: '1. Select Direct Purchase Centre (Thanjavur Zone):',
        step2: '2. Select Arrival Time Window:',
        step3: '3. Estimated Produce Load (Quintals):',
        commodityInfo: 'Commodity: Paddy (Grade A) • MSP: ₹2,320/Quintal • Guaranteed Direct Benefit Transfer within 48h',
        capacityFull: 'CAPACITY FULL',
        slots: 'slots',
        recommendedAlternatives: '💡 Recommended available alternatives with zero gate wait:',
        selectAndReserve: 'Select & Reserve',
        securingSlot: 'Securing Slot...',
        confirmButton: 'Confirm & Generate Virtual Token'
      },
      receiptModal: {
        govHeader: 'GOVERNMENT OF TAMIL NADU • DEPARTMENT OF FOOD & CIVIL SUPPLIES',
        title: 'Digital Procurement Weighbridge Receipt',
        receiptLabel: 'RECEIPT:',
        tokenLabel: 'TOKEN:',
        farmerName: 'Farmer Name:',
        centreName: 'Procurement Centre:',
        commodityVariety: 'Commodity Variety:',
        timestamp: 'Recorded Timestamp:',
        aadhaar: 'Aadhaar (Masked):',
        bankDbt: 'Bank DBT Account:',
        grossWeight: 'Gross Weight (Loaded):',
        tareWeight: 'Tare Weight (Vehicle / Sacks):',
        moistureReading: 'Moisture Reading:',
        moistureStandard: '(Allowable standard: 14.0%)',
        excessMoistureDed: 'Excess Moisture Deduction:',
        netQuantity: 'Net Accepted Quantity:',
        mspRate: 'MSP Government Rate:',
        netPayable: 'Net Payable to Farmer:',
        dbtStatusTitle: 'PFMS DIRECT BENEFIT TRANSFER STATUS',
        authenticated: 'AUTHENTICATED'
      }
    },
    operator: {
      consoleBadge: 'OPERATIONS CONSOLE',
      liveTag: 'PPC-01 • LIVE',
      operatorLabel: 'Operator:',
      consoleTitle: 'Pillaiyarpatti PPC — Live Operations Console',
      mandatedInfo: 'Mandated Commodity: Paddy (Grade A) • MSP Rate: ₹2,320/Quintal • Kharif KMS 2026',
      dbtReconcileBtn: 'DBT Reconcile',
      pending: 'Pending',
      assistedRegister: '+ Assisted Walk-in Registration',
      telemetry: {
        dailyCapacity: 'Daily Capacity',
        allocated: 'Allocated',
        arrivalsAtGate: 'Arrivals at Gate',
        expectedTotalToday: 'Expected Total Today:',
        completedWeighings: 'Completed Weighings',
        receiptsDispatched: 'Digital Receipts Dispatched',
        activeWaitingQueue: 'Active Waiting Queue',
        throughput: 'Throughput: ~12 mins / load'
      },
      dbtDesk: {
        title: 'Direct Benefit Transfer (PFMS DBT) Reconciliation Desk',
        subtitle: 'Operator approval dispatches SMS payout alerts to verified farmer bank accounts.',
        close: 'Close Desk',
        receiptRef: 'Receipt Ref',
        farmerDetails: 'Farmer Details',
        payable: 'Payable (₹)',
        bankDbtMasked: 'Bank DBT Masked',
        status: 'Status',
        action: 'Reconciliation Action',
        confirmCredit: 'Confirm Bank Credit ✅',
        sendPfms: 'Send to PFMS 🏦',
        credited: 'Credited to Farmer 💰'
      },
      baySelector: {
        label: 'Active Counter Bay:',
        serving: 'Serving:',
        bayFree: 'Bay Free'
      },
      callNext: 'Call Next Token',
      queueTable: {
        title: 'Live Centre Queue Flow',
        subtitle: 'Real-time FIFO queue with priority allocation for elderly & smallholder farmers',
        searchPlaceholder: 'Search token, farmer or village...',
        filterAll: 'ALL',
        filterActive: 'ACTIVE',
        filterWaiting: 'WAITING',
        filterCompleted: 'COMPLETED',
        startService: 'Start Service',
        weighbridgeQuality: 'Weighbridge & Quality',
        defer: 'Defer',
        noShow: 'No-Show',
        receiptIssued: 'Receipt Issued ✅'
      },
      tokenColumn: 'Token',
      farmerColumn: 'Farmer Name & Village',
      quantityColumn: 'Expected Qtl',
      stateColumn: 'State',
      bayColumn: 'Bay / Counter',
      actionsColumn: 'Actions',
      weighingModal: {
        title: 'Weighbridge & Quality Station —',
        farmer: 'Farmer:',
        declared: 'Declared:',
        paddy: 'Qtl Paddy',
        scaleTitle: 'METROLOGY CALIBRATED WEIGHBRIDGE SCALE #1',
        scaleStatus: 'STATUS: STABLE',
        grossKg: 'KG GROSS',
        grossLabel: 'Gross Load Weight (Quintals):',
        tareLabel: 'Tare Weight (Vehicle/Sacks) (Quintals):',
        moistureLabel: 'Moisture Content Analyzer (%):',
        moistureExcess: 'Excess moisture deduction applies',
        moistureOk: 'Within acceptable moisture range (≤ 14.0%)',
        gradingLabel: 'Official Grading:',
        gradeA: 'Paddy Grade A (MSP ₹2,320 / Qtl)',
        common: 'Common Paddy (MSP ₹2,300 / Qtl)',
        netQty: 'Net Quantity (Gross - Tare):',
        moistureDed: 'Moisture Deduction:',
        finalPayable: 'Final Payable Quantity:',
        netPayable: 'Net Payable to Farmer:',
        generatingReceipt: 'Generating Receipt...',
        approveButton: 'Approve & Issue Digital Receipt'
      },
      walkinModal: {
        title: 'Assisted Walk-in Farmer Entry',
        nameLabel: 'Farmer Full Name:',
        namePlaceholder: 'e.g. Karuppasamy',
        mobileLabel: 'Mobile Number:',
        mobilePlaceholder: '10-digit mobile',
        villageLabel: 'Village / Taluk:',
        qtyLabel: 'Brought Load (Quintals):',
        generatingToken: 'Generating Token...',
        registerButton: 'Register & Check In'
      }
    },
    admin: {
      districtCommand: 'DISTRICT COMMAND',
      collectorLabel: 'District Collector:',
      title: 'District Procurement Operations & Congestion Control',
      subtitle: 'Thanjavur Agri District Procurement Division • Kharif KMS 2026-27 Monitoring',
      exportCsv: 'Export Daily Report (CSV)',
      kpis: {
        monitoredCentres: 'Monitored Centres',
        operationalToday: '100% Operational Today',
        plannedCapacity: 'Planned Daily Capacity',
        bookedVolume: 'Booked:',
        servedToday: 'Farmers Served Today',
        dbtProcessing: 'DBT Payments Processing',
        activeWaiting: 'Active Waiting Queue',
        acrossCentres: 'Across All 4 Centres'
      },
      congestionMap: 'Real-time Centre Congestion Heatmap',
      congestionSubtitle: 'Real-time load balancing view across APMCs to redirect farmers and avert mandi congestion',
      heatmapOptimal: 'Optimal (<75%)',
      heatmapDemand: 'Heavy Demand (80-95%)',
      heatmapCritical: 'Critical Overflow (>95%)',
      centreUnit: 'PPC District Unit',
      capacityBooked: 'Capacity Booked:',
      waiting: 'Waiting:',
      completed: 'Completed:',
      avgWaiting: 'Avg Waiting:',
      activeCounters: 'Active Counters:',
      farmers: 'farmers',
      bays: 'bays',
      mins: 'mins',
      auditLog: 'Immutable Audit Trail',
      auditSubtitle: 'Append-only tamper-evident event stream capturing every state transition, weighing, and DBT disbursement',
      refreshTrail: 'Refresh Trail',
      auditTable: {
        eventType: 'Event Type',
        entity: 'Entity',
        actor: 'Authorized Actor',
        centre: 'Centre',
        summary: 'Audit Summary',
        timestamp: 'Timestamp',
        districtCommand: 'District Command'
      }
    }
  },
  hi: {
    appTitle: 'प्रोक्योरफ्लो (ProcureFlow)',
    appSubtitle: 'स्मार्ट खरीद केंद्र कतार और स्थिति प्रबंधन मंच',
    sihTag: 'SIH 2026 समस्या 26032 • उपभोक्ता मामले विभाग',
    govtHeader: 'उपभोक्ता मामले विभाग (DoCA) • उपभोक्ता मामले, खाद्य एवं सार्वजनिक वितरण मंत्रालय',
    sihBadge: 'SIH 2026 समस्या विवरण 26032',
    realtimeConnected: 'रीयल-टाइम एसएसई कनेक्टेड (12ms)',
    fallbackSync: 'फॉलबैक सिंक',
    zoneTag: 'तंजावुर कृषि क्षेत्र • खरीफ KMS 2026',
    footerText: 'प्रोक्योरफ्लो • स्मार्ट खरीद केंद्र कतार और स्थिति मंच',
    footerSubtext: 'स्मार्ट इंडिया हैकथॉन 2026 के लिए निर्मित • उपभोक्ता मामले, खाद्य एवं सार्वजनिक वितरण मंत्रालय',
    footerTagline: 'शून्य गेट कतारें • 100% पारदर्शी डीबीटी भुगतान',
    roles: {
      FARMER: 'किसान पोर्टल',
      OPERATOR: 'केंद्र ऑपरेटर कंसोल',
      DISTRICT_ADMIN: 'जिला प्रशासन डैशबोर्ड'
    },
    demoBar: {
      persona: 'डेमो प्रोफाइल',
      language: 'भाषा',
      resetData: 'रीसेट करें',
      resetting: 'रीसेट हो रहा है...',
      liveSync: 'लाइव सिंक',
      connected: 'केंद्र लाइव स्ट्रीम से जुड़ा हुआ है'
    },
    common: {
      cancel: 'रद्द करें',
      confirm: 'पुष्टि करें',
      close: 'बंद करें',
      done: 'संपन्न',
      print: 'आधिकारिक पर्ची प्रिंट करें 🖨️',
      loading: 'लोड हो रहा है...',
      actions: 'कार्रवाई',
      records: 'रिकॉर्ड',
      optimal: 'अनुकूल',
      heavyTraffic: 'भारी भीड़',
      scheduled: 'निर्धारित',
      status: 'स्थिति',
      date: 'तारीख',
      time: 'समय',
      quintals: 'क्विंटल',
      rupees: '₹'
    },
    farmer: {
      welcome: 'नमस्ते,',
      farmerRef: 'किसान आईडी:',
      verifiedProfile: 'सत्यापित किसान प्रोफ़ाइल',
      kharifQuota: 'खरीफ 2026 कोटा',
      eligiblePaddy: 'ग्रेड-ए धान हेतु पात्र',
      bookNewSlot: 'नया खरीद स्लॉट बुक करें',
      activeBookingTitle: 'आपकी अगली खरीद बुकिंग',
      officialDigitalPass: 'आधिकारिक डिजिटल पास',
      docaNetwork: 'DoCA APMC नेटवर्क',
      tokenNumber: 'वर्चुअल टोकन',
      bookingRef: 'संदर्भ संख्या:',
      procurementDate: 'खरीद की तारीख',
      arrivalWindow: 'आगमन समय स्लॉट',
      cropExpectedVolume: 'फसल / अनुमानित मात्रा',
      currentStatus: 'वर्तमान स्थिति',
      peopleAhead: 'आपसे आगे कुल किसान',
      ahead: 'आगे',
      estimatedWait: 'अनुमानित प्रतीक्षा समय',
      arrivalPending: 'आगमन शेष (गेट चेक-इन करें)',
      estWaitMinutes: 'अनुमानित प्रतीक्षा समय: ~',
      minutes: 'मिनट',
      tokenIsCalled: 'आपका टोकन बुलाया गया है!',
      weighingInProgress: 'काउंटर पर तौल कार्य प्रगति पर है',
      procurementComplete: 'खरीद प्रक्रिया पूर्ण',
      arrivalPendingDesc: 'मंडी गेट पर चेक-इन करने से आपका वर्चुअल टोकन सक्रिय होगा और डिजिटल कतार में स्थान मिलेगा।',
      dynamicQueueDesc: 'सिस्टम वास्तविक तौल समय के आधार पर कतार क्रम को गतिशील रूप से समायोजित करता है।',
      checkInNow: 'मैं पहुँच गया हूँ • चेक-इन करें',
      viewReceipt: 'रसीद देखें',
      stepper: {
        booked: '1. स्लॉट बुक',
        gateCheckin: '2. गेट चेक-इन',
        weighbridge: '3. तौल कांटा वे-ब्रिज',
        qualityCheck: '4. नमी व गुणवत्ता जांच',
        dbtCredit: '5. डीबीटी बैंक भुगतान'
      },
      urgentAlert: {
        title: 'तत्काल कार्रवाई आवश्यक',
        calledTo: '🚨 आपका टोकन बुलाया गया है! तुरंत जाएँ:',
        instructions: 'कृपया अपने ट्रैक्टर/वाहन को वे-ब्रिज वजन के लिए आवंटित बे में ले जाएँ।',
        playChime: 'अलर्ट घंटी बजाएँ 🔔'
      },
      noActiveBooking: 'आज के लिए कोई सक्रिय बुकिंग नहीं है।',
      noActiveBookingDesc: 'मंडी गेट पर लंबी कतारों से बचने के लिए अपना स्लॉट पहले से आरक्षित करें।',
      historyTitle: 'खरीद इतिहास एवं डिजिटल रसीदें',
      notifications: 'हालिया अलर्ट और एसएमएस',
      notificationsLive: 'एसएमएस एवं पुश लाइव',
      deliveredTo: 'भेजा गया मोबाइल नंबर:',
      bookingModal: {
        title: 'नया खरीद स्लॉट बुक करें',
        subtitle: 'उपभोक्ता मामले विभाग (DoCA) खरीद बुकिंग प्रणाली',
        step1: '1. प्रत्यक्ष खरीद केंद्र चुनें (तंजावुर क्षेत्र):',
        step2: '2. आगमन समय स्लॉट चुनें:',
        step3: '3. अनुमानित उपज मात्रा (क्विंटल):',
        commodityInfo: 'फसल: धान (ग्रेड ए) • एमएसपी: ₹2,320/क्विंटल • 48 घंटे के भीतर बैंक खाते में गारंटीड डीबीटी भुगतान',
        capacityFull: 'क्षमता पूर्ण',
        slots: 'स्लॉट शेष',
        recommendedAlternatives: '💡 शून्य प्रतीक्षा समय वाले अनुशंसित वैकल्पिक स्लॉट:',
        selectAndReserve: 'चुनें और आरक्षित करें',
        securingSlot: 'स्लॉट सुरक्षित किया जा रहा है...',
        confirmButton: 'पुष्टि करें और वर्चुअल टोकन जारी करें'
      },
      receiptModal: {
        govHeader: 'तमिलनाडु सरकार • खाद्य एवं नागरिक आपूर्ति विभाग',
        title: 'डिजिटल खरीद वे-ब्रिज आधिकारिक रसीद',
        receiptLabel: 'रसीद संख्या:',
        tokenLabel: 'टोकन संख्या:',
        farmerName: 'किसान का नाम:',
        centreName: 'खरीद केंद्र:',
        commodityVariety: 'फसल की किस्म:',
        timestamp: 'दर्ज समय:',
        aadhaar: 'आधार (सुरक्षित):',
        bankDbt: 'डीबीटी बैंक खाता:',
        grossWeight: 'सकल भार (वाहन सहित):',
        tareWeight: 'खाली वाहन का भार (टेयर):',
        moistureReading: 'नमी प्रतिशत:',
        moistureStandard: '(अनुमेय मानक: 14.0%)',
        excessMoistureDed: 'अतिरिक्त नमी कटौती:',
        netQuantity: 'स्वीकृत शुद्ध मात्रा:',
        mspRate: 'सरकारी एमएसपी दर:',
        netPayable: 'किसान को देय कुल राशि:',
        dbtStatusTitle: 'PFMS डायरेक्ट बेनिफिट ट्रांसफर (डीबीटी) स्थिति',
        authenticated: 'सत्यापित एवं अधिकृत'
      }
    },
    operator: {
      consoleBadge: 'ऑपरेशंस कंसोल',
      liveTag: 'PPC-01 • लाइव',
      operatorLabel: 'ऑपरेटर:',
      consoleTitle: 'पिल्लैयारपट्टी केंद्र — लाइव ऑपरेशंस कंसोल',
      mandatedInfo: 'अधिसूचित फसल: धान (ग्रेड ए) • एमएसपी दर: ₹2,320/क्विंटल • खरीफ KMS 2026',
      dbtReconcileBtn: 'डीबीटी समाधान',
      pending: 'लंबित',
      assistedRegister: '+ वॉक-इन किसान पंजीकरण',
      telemetry: {
        dailyCapacity: 'दैनिक नियोजित क्षमता',
        allocated: 'आवंटित',
        arrivalsAtGate: 'गेट पर आगमन',
        expectedTotalToday: 'आज का कुल अनुमान:',
        completedWeighings: 'पूर्ण की गई तौल',
        receiptsDispatched: 'डिजिटल रसीदें जारी',
        activeWaitingQueue: 'कतार में सक्रिय प्रतीक्षा',
        throughput: 'गति: ~12 मिनट / किसान'
      },
      dbtDesk: {
        title: 'डायरेक्ट बेनिफिट ट्रांसफर (PFMS DBT) भुगतान समाधान डेस्क',
        subtitle: 'ऑपरेटर की स्वीकृति से किसान के बैंक खाते में तुरंत एसएमएस और राशि हस्तांतरण होता है।',
        close: 'डेस्क बंद करें',
        receiptRef: 'रसीद संदर्भ',
        farmerDetails: 'किसान विवरण',
        payable: 'देय राशि (₹)',
        bankDbtMasked: 'बैंक डीबीटी खाता',
        status: 'स्थिति',
        action: 'समाधान कार्रवाई',
        confirmCredit: 'बैंक भुगतान पुष्टि करें ✅',
        sendPfms: 'PFMS को भेजें 🏦',
        credited: 'किसान खाते में जमा 💰'
      },
      baySelector: {
        label: 'सक्रिय तौल काउंटर बे:',
        serving: 'वर्तमान सेवा:',
        bayFree: 'काउंटर खाली है'
      },
      callNext: 'अगला टोकन बुलाएँ',
      queueTable: {
        title: 'लाइव केंद्र कतार प्रवाह',
        subtitle: 'बुजुर्ग एवं छोटे किसानों के लिए प्राथमिकता आवंटन सहित रीयल-टाइम कतार',
        searchPlaceholder: 'टोकन, किसान का नाम या गाँव खोजें...',
        filterAll: 'सभी',
        filterActive: 'सक्रिय',
        filterWaiting: 'प्रतीक्षारत',
        filterCompleted: 'पूर्ण',
        startService: 'सेवा शुरू करें',
        weighbridgeQuality: 'तौल एवं गुणवत्ता दर्ज करें',
        defer: 'स्थगित करें',
        noShow: 'अनुपस्थित',
        receiptIssued: 'रसीद जारी ✅'
      },
      tokenColumn: 'टोकन',
      farmerColumn: 'किसान का नाम व गाँव',
      quantityColumn: 'अनुमानित मात्रा',
      stateColumn: 'स्थिति',
      bayColumn: 'काउंटर बे',
      actionsColumn: 'कार्रवाई',
      weighingModal: {
        title: 'वे-ब्रिज तौल एवं गुणवत्ता स्टेशन —',
        farmer: 'किसान:',
        declared: 'घोषित मात्रा:',
        paddy: 'क्विंटल धान',
        scaleTitle: 'मापविज्ञान अंशांकित वे-ब्रिज पैमाना #1',
        scaleStatus: 'स्थिति: स्थिर',
        grossKg: 'किलोग्राम सकल',
        grossLabel: 'सकल भार (क्विंटल):',
        tareLabel: 'टेयर/खाली भार (क्विंटल):',
        moistureLabel: 'नमी मापक विश्लेषक (%):',
        moistureExcess: 'अतिरिक्त नमी कटौती लागू होगी',
        moistureOk: 'स्वीकार्य मानक सीमा में (≤ 14.0%)',
        gradingLabel: 'आधिकारिक ग्रेडिंग:',
        gradeA: 'धान ग्रेड ए (एमएसपी ₹2,320 / क्विंटल)',
        common: 'सामान्य धान (एमएसपी ₹2,300 / क्विंटल)',
        netQty: 'शुद्ध मात्रा (सकल - टेयर):',
        moistureDed: 'नमी कटौती:',
        finalPayable: 'अंतिम देय मात्रा:',
        netPayable: 'किसान को शुद्ध देय राशि:',
        generatingReceipt: 'रसीद बनाई जा रही है...',
        approveButton: 'स्वीकृत करें एवं डिजिटल रसीद जारी करें'
      },
      walkinModal: {
        title: 'सहायता प्राप्त वॉक-इन किसान पंजीकरण',
        nameLabel: 'किसान का पूरा नाम:',
        namePlaceholder: 'उदा. करुपसामी',
        mobileLabel: 'मोबाइल नंबर:',
        mobilePlaceholder: '10 अंकों का मोबाइल नंबर',
        villageLabel: 'गाँव / तालुक:',
        qtyLabel: 'लाई गई फसल मात्रा (क्विंटल):',
        generatingToken: 'टोकन बनाया जा रहा है...',
        registerButton: 'पंजीकरण करें एवं चेक-इन करें'
      }
    },
    admin: {
      districtCommand: 'जिला कमान केंद्र',
      collectorLabel: 'जिला कलेक्टर:',
      title: 'जिला खरीद परिचालन एवं भीड़ नियंत्रण डैशबोर्ड',
      subtitle: 'तंजावुर कृषि जिला खरीद प्रभाग • खरीफ KMS 2026-27 निगरानी',
      exportCsv: 'दैनिक रिपोर्ट निर्यात करें (CSV)',
      kpis: {
        monitoredCentres: 'निगरानी में केंद्र',
        operationalToday: '100% आज संचालित',
        plannedCapacity: 'दैनिक नियोजित क्षमता',
        bookedVolume: 'बुक की गई मात्रा:',
        servedToday: 'आज पूर्ण की गई खरीद',
        dbtProcessing: 'डीबीटी भुगतान प्रक्रिया जारी',
        activeWaiting: 'कतार में सक्रिय प्रतीक्षा',
        acrossCentres: 'सभी 4 केंद्रों में कुल'
      },
      congestionMap: 'रीयल-टाइम केंद्र भीड़ हीटमैप',
      congestionSubtitle: 'किसानों को पुनर्निर्देशित करने और मंडियों में भीड़ रोकने के लिए रीयल-टाइम लोड बैलेंसिंग दृश्य',
      heatmapOptimal: 'अनुकूल (<75%)',
      heatmapDemand: 'भारी मांग (80-95%)',
      heatmapCritical: 'गंभीर भीड़ (>95%)',
      centreUnit: 'PPC जिला इकाई',
      capacityBooked: 'क्षमता बुक:',
      waiting: 'प्रतीक्षारत:',
      completed: 'पूर्ण:',
      avgWaiting: 'औसत प्रतीक्षा:',
      activeCounters: 'सक्रिय काउंटर:',
      farmers: 'किसान',
      bays: 'काउंटर',
      mins: 'मिनट',
      auditLog: 'अपरिवर्तनीय ऑडिट लॉग',
      auditSubtitle: 'प्रत्येक स्थिति परिवर्तन, तौल और डीबीटी भुगतान को रिकॉर्ड करने वाली सुरक्षित इवेंट स्ट्रीम',
      refreshTrail: 'ऑडिट रिफ्रेश करें',
      auditTable: {
        eventType: 'इवेंट प्रकार',
        entity: 'इकाई',
        actor: 'अधिकृत अधिकारी',
        centre: 'केंद्र',
        summary: 'ऑडिट सारांश',
        timestamp: 'समय',
        districtCommand: 'जिला मुख्यालय'
      }
    }
  },
  ta: {
    appTitle: 'ப்ரோக்யூர்ஃப்ளோ (ProcureFlow)',
    appSubtitle: 'நேரடி நெல் கொள்முதல் நிலைய வரிசை & நிலை கண்காணிப்பு தளம்',
    sihTag: 'SIH 2026 பிரச்சனை எண் 26032 • நுகர்வோர் விவகாரங்கள் துறை',
    govtHeader: 'நுகர்வோர் விவகாரங்கள் துறை (DoCA) • நுகர்வோர் விவகாரங்கள், உணவு மற்றும் பொது விநியோக அமைச்சகம்',
    sihBadge: 'SIH 2026 பிரச்சனை அறிக்கை 26032',
    realtimeConnected: 'நேரடி SSE இணைப்பு செயலில் உள்ளது (12ms)',
    fallbackSync: 'காப்பு ஒத்திசைவு',
    zoneTag: 'தஞ்சாவூர் வேளாண் மண்டலம் • காரீப் KMS 2026',
    footerText: 'ப்ரோக்யூர்ஃப்ளோ • நேரடி கொள்முதல் நிலைய வரிசை & நிலை கண்காணிப்பு',
    footerSubtext: 'ஸ்மார்ட் இந்தியா ஹேக்கத்தான் 2026க்காக உருவாக்கப்பட்டது • நுகர்வோர் விவகாரங்கள், உணவு மற்றும் பொது விநியோக அமைச்சகம்',
    footerTagline: 'பூஜ்ஜிய வாயில் காத்திருப்பு • 100% வெளிப்படையான நேரடி வங்கிப் பரிமாற்றம் (DBT)',
    roles: {
      FARMER: 'விவசாயி போர்ட்டல்',
      OPERATOR: 'நிலைய ஆபரேட்டர் கன்சோல்',
      DISTRICT_ADMIN: 'மாவட்ட நிர்வாக டேஷ்போர்டு'
    },
    demoBar: {
      persona: 'டெமோ பயனர்',
      language: 'மொழி',
      resetData: 'மீட்டமைக்க',
      resetting: 'மீட்டமைக்கப்படுகிறது...',
      liveSync: 'நேரடி இணைப்பு',
      connected: 'நிலையத்துடன் இணைக்கப்பட்டுள்ளது'
    },
    common: {
      cancel: 'ரத்து செய்க',
      confirm: 'உறுதி செய்க',
      close: 'மூடுக',
      done: 'முடிந்தது',
      print: 'அதிகாரப்பூர்வ ரசீதை அச்சிடுக 🖨️',
      loading: 'ஏற்றப்படுகிறது...',
      actions: 'நடவடிக்கைகள்',
      records: 'பதிவுகள்',
      optimal: 'சரியான நிலை',
      heavyTraffic: 'அதிக நெரிசல்',
      scheduled: 'திட்டமிடப்பட்டது',
      status: 'நிலை',
      date: 'தேதி',
      time: 'நேரம்',
      quintals: 'குவிண்டால்',
      rupees: '₹'
    },
    farmer: {
      welcome: 'வணக்கம்,',
      farmerRef: 'விவசாயி பதிவு எண்:',
      verifiedProfile: 'சரிபார்க்கப்பட்ட விவசாயி சுயவிவரம்',
      kharifQuota: 'காரீப் 2026 ஒதுக்கீடு',
      eligiblePaddy: 'கிரேடு-ஏ நெல்லுக்கு தகுதியானது',
      bookNewSlot: 'புதிய கொள்முதல் முன்பதிவு செய்க',
      activeBookingTitle: 'உங்கள் கொள்முதல் முன்பதிவு விவரம்',
      officialDigitalPass: 'அதிகாரப்பூர்வ டிஜிட்டல் பாஸ்',
      docaNetwork: 'DoCA APMC நெட்வொர்க்',
      tokenNumber: 'டோக்கன் எண்',
      bookingRef: 'முன்பதிவு எண்:',
      procurementDate: 'கொள்முதல் தேதி',
      arrivalWindow: 'வருகை நேர இடைவெளி',
      cropExpectedVolume: 'பயிர் / எதிர்பார்க்கப்படும் அளவு',
      currentStatus: 'தற்போதைய நிலை',
      peopleAhead: 'உங்களுக்கு முன்னால் உள்ள விவசாயிகள்',
      ahead: 'முன்னால்',
      estimatedWait: 'மதிப்பிடப்பட்ட காத்திருப்பு நேரம்',
      arrivalPending: 'வருகை பதிவு செய்க (செக்-இன்)',
      estWaitMinutes: 'மதிப்பிடப்பட்ட காத்திருப்பு நேரம்: ~',
      minutes: 'நிமிடம்',
      tokenIsCalled: 'உங்கள் டோக்கன் அழைக்கப்பட்டது!',
      weighingInProgress: 'எடை மேடையில் எடை போடுதல் நடக்கிறது',
      procurementComplete: 'கொள்முதல் நிறைவடைந்தது',
      arrivalPendingDesc: 'மண்டி வாயிலில் செக்-இன் செய்வதன் மூலம் உங்கள் டோக்கன் செயல்படுத்தப்பட்டு டிஜிட்டல் வரிசை ஒதுக்கப்படும்.',
      dynamicQueueDesc: 'உண்மையான எடை போடும் நேரத்திற்கு ஏற்ப அமைப்பு தானாக வரிசையை மாற்றி அமைக்கிறது.',
      checkInNow: 'நான் வந்துவிட்டேன் • செக்-இன் செய்க',
      viewReceipt: 'ரசீதை காண்க',
      stepper: {
        booked: '1. முன்பதிவு',
        gateCheckin: '2. வாயில் செக்-இன்',
        weighbridge: '3. எடை மேடை',
        qualityCheck: '4. தரப் பரிசோதனை',
        dbtCredit: '5. நேரடி வங்கி வரவு (DBT)'
      },
      urgentAlert: {
        title: 'உடனடி நடவடிக்கை தேவை',
        calledTo: '🚨 உங்கள் டோக்கன் அழைக்கப்பட்டது! உடனே செல்லவும்:',
        instructions: 'உங்கள் டிராக்டர்/வாகனத்தை எடை மேடைக்கு கொண்டு செல்லவும்.',
        playChime: 'அறிவிப்பு மணியை ஒலிக்கவும் 🔔'
      },
      noActiveBooking: 'இன்று முன்பதிவு ஏதுமில்லை.',
      noActiveBookingDesc: 'மண்டி வாயிலில் காத்திருப்பதை தவிர்க்க உங்கள் கொள்முதல் நேரத்தை முன்கூட்டியே முன்பதிவு செய்யவும்.',
      historyTitle: 'கொள்முதல் வரலாறு & டிஜிட்டல் ரசீதுகள்',
      notifications: 'சமீபத்திய அறிவிப்புகள் & SMS',
      notificationsLive: 'SMS மற்றும் நேரடி அறிவிப்புகள்',
      deliveredTo: 'அனுப்பப்பட்ட கைபேசி எண்:',
      bookingModal: {
        title: 'புதிய கொள்முதல் நேர முன்பதிவு செய்க',
        subtitle: 'நுகர்வோர் விவகாரங்கள் துறை (DoCA) கொள்முதல் முன்பதிவு முறைமை',
        step1: '1. நேரடி நெல் கொள்முதல் நிலையத்தை தேர்ந்தெடுக்கவும் (தஞ்சாவூர் மண்டலம்):',
        step2: '2. வருகை நேர இடைவெளியை தேர்ந்தெடுக்கவும்:',
        step3: '3. கொண்டுவரும் நெல் அளவு (குவிண்டால்):',
        commodityInfo: 'பயிர்: நெல் (கிரேடு ஏ) • ஆதார விலை (MSP): ₹2,320/குவிண்டால் • 48 மணி நேரத்திற்குள் வங்கிக் கணக்கில் நேரடி வரவு',
        capacityFull: 'முழு கொள்ளளவு நிறைந்தது',
        slots: 'இடங்கள் மீதம்',
        recommendedAlternatives: '💡 பூஜ்ஜிய காத்திருப்பு கொண்ட பரிந்துரைக்கப்பட்ட மாற்று நேரங்கள்:',
        selectAndReserve: 'தேர்வு செய்து முன்பதிவு செய்க',
        securingSlot: 'இடம் ஒதுக்கப்படுகிறது...',
        confirmButton: 'உறுதி செய்து டோக்கன் பெறுக'
      },
      receiptModal: {
        govHeader: 'தமிழ்நாடு அரசு • உணவு மற்றும் நுகர்பொருள் வழங்கல் துறை',
        title: 'டிஜிட்டல் நெல் கொள்முதல் எடை ரசீது',
        receiptLabel: 'ரசீது எண்:',
        tokenLabel: 'டோக்கன் எண்:',
        farmerName: 'விவசாயி பெயர்:',
        centreName: 'கொள்முதல் நிலையம்:',
        commodityVariety: 'பயிர் ரகம்:',
        timestamp: 'பதிவு செய்யப்பட்ட நேரம்:',
        aadhaar: 'ஆதார் எண் (மறைக்கப்பட்டது):',
        bankDbt: 'DBT வங்கிக் கணக்கு:',
        grossWeight: 'மொத்த எடை (வாகனத்துடன்):',
        tareWeight: 'வாகனத்தின் எடை (கழித்தல்):',
        moistureReading: 'ஈரப்பத அளவு:',
        moistureStandard: '(அனுமதிக்கப்பட்ட அளவு: 14.0%)',
        excessMoistureDed: 'அதிக ஈரப்பதம் கழிவு:',
        netQuantity: 'ஏற்றுக்கொள்ளப்பட்ட நிகர அளவு:',
        mspRate: 'அரசு நிர்ணயித்த MSP விலை:',
        netPayable: 'விவசாயிக்கு வழங்கப்படும் மொத்த தொகை:',
        dbtStatusTitle: 'PFMS நேரடி வங்கிப் பரிமாற்ற (DBT) நிலை',
        authenticated: 'சரிபார்க்கப்பட்டு அங்கீகரிக்கப்பட்டது'
      }
    },
    operator: {
      consoleBadge: 'நிலைய கன்சோல்',
      liveTag: 'PPC-01 • நேரலை',
      operatorLabel: 'ஆபரேட்டர்:',
      consoleTitle: 'பிள்ளையார்பட்டி நேரடி நெல் கொள்முதல் நிலையம் — நேரடி கன்சோல்',
      mandatedInfo: 'அங்கீகரிக்கப்பட்ட பயிர்: நெல் (கிரேடு ஏ) • MSP விலை: ₹2,320/குவிண்டால் • காரீப் KMS 2026',
      dbtReconcileBtn: 'DBT பணப்பட்டுவாடா',
      pending: 'நிலுவை',
      assistedRegister: '+ புதிய விவசாயி பதிவு',
      telemetry: {
        dailyCapacity: 'தினசரி திட்டமிடப்பட்ட கொள்ளளவு',
        allocated: 'ஒதுக்கப்பட்டது',
        arrivalsAtGate: 'வாயிலுக்கு வந்தவர்கள்',
        expectedTotalToday: 'இன்றைய மொத்த எதிர்பார்ப்பு:',
        completedWeighings: 'முடிக்கப்பட்ட எடை போடுதல்கள்',
        receiptsDispatched: 'வழங்கப்பட்ட டிஜிட்டல் ரசீதுகள்',
        activeWaitingQueue: 'வரிசையில் காத்திருப்போர்',
        throughput: 'வேகம்: ~12 நிமிடம் / விவசாயி'
      },
      dbtDesk: {
        title: 'நேரடி வங்கிப் பரிமாற்ற (PFMS DBT) சரிபார்ப்பு பிரிவு',
        subtitle: 'ஆபரேட்டர் ஒப்புதல் அளித்தவுடன் விவசாயிகளின் வங்கிக் கணக்கிற்கு SMS மற்றும் பணம் அனுப்பப்படும்.',
        close: 'பிரிவை மூடுக',
        receiptRef: 'ரசீது எண்',
        farmerDetails: 'விவசாயி விவரங்கள்',
        payable: 'வழங்க வேண்டிய தொகை (₹)',
        bankDbtMasked: 'DBT வங்கிக் கணக்கு',
        status: 'நிலை',
        action: 'சரிபார்ப்பு நடவடிக்கை',
        confirmCredit: 'வங்கி வரவை உறுதி செய்க ✅',
        sendPfms: 'PFMS-க்கு அனுப்புக 🏦',
        credited: 'விவசாயிக்கு வரவு வைக்கப்பட்டது 💰'
      },
      baySelector: {
        label: 'செயலில் உள்ள எடை மேடை:',
        serving: 'தற்போது:',
        bayFree: 'மேடை காலியாக உள்ளது'
      },
      callNext: 'அடுத்த டோக்கனை அழைக்கவும்',
      queueTable: {
        title: 'நிலையத்தின் நேரடி வரிசை ஓட்டம்',
        subtitle: 'முதியவர்கள் மற்றும் சிறு விவசாயிகளுக்கு முன்னுரிமை அளிக்கும் நேரடி வரிசை முறைமை',
        searchPlaceholder: 'டோக்கன், விவசாயி பெயர் அல்லது ஊரை தேடுக...',
        filterAll: 'அனைத்தும்',
        filterActive: 'செயலில் உள்ளவை',
        filterWaiting: 'காத்திருப்போர்',
        filterCompleted: 'முடிந்தவை',
        startService: 'சேவையைத் தொடங்கு',
        weighbridgeQuality: 'எடை & தரம் பதிவு செய்க',
        defer: 'தள்ளிவைக்க',
        noShow: 'வராதவர்',
        receiptIssued: 'ரசீது வழங்கப்பட்டது ✅'
      },
      tokenColumn: 'டோக்கன்',
      farmerColumn: 'விவசாயி பெயர் & ஊர்',
      quantityColumn: 'எதிர்பார்க்கப்படும் அளவு',
      stateColumn: 'நிலை',
      bayColumn: 'எடை மேடை',
      actionsColumn: 'நடவடிக்கைகள்',
      weighingModal: {
        title: 'எடை மேடை & தரப் பரிசோதனை பிரிவு —',
        farmer: 'விவசாயி:',
        declared: 'அறிவிக்கப்பட்ட அளவு:',
        paddy: 'குவிண்டால் நெல்',
        scaleTitle: 'அளவியல் சான்றளிக்கப்பட்ட எடை மேடை #1',
        scaleStatus: 'நிலை: நிலையானது',
        grossKg: 'கிலோகிராம் மொத்த எடை',
        grossLabel: 'மொத்த சுமை எடை (குவிண்டால்):',
        tareLabel: 'வாகன எடை (குவிண்டால்):',
        moistureLabel: 'ஈரப்பத அளவீடு (%):',
        moistureExcess: 'அதிக ஈரப்பத கழிவு பொருந்தும்',
        moistureOk: 'அனுமதிக்கப்பட்ட வரம்பிற்குள் உள்ளது (≤ 14.0%)',
        gradingLabel: 'அதிகாரப்பூர்வ தரம்:',
        gradeA: 'நெல் கிரேடு ஏ (MSP ₹2,320 / குவிண்டால்)',
        common: 'சாதாரண நெல் (MSP ₹2,300 / குவிண்டால்)',
        netQty: 'நிகர எடை (மொத்தம் - வாகனம்):',
        moistureDed: 'ஈரப்பதம் கழிவு:',
        finalPayable: 'இறுதி கொள்முதல் அளவு:',
        netPayable: 'விவசாயிக்கு வழங்க வேண்டிய தொகை:',
        generatingReceipt: 'ரசீது உருவாக்கப்படுகிறது...',
        approveButton: 'ஒப்புதல் அளித்து ரசீதை வெளியிடுக'
      },
      walkinModal: {
        title: 'நேரடி வருகை விவசாயி பதிவு',
        nameLabel: 'விவசாயி முழுப் பெயர்:',
        namePlaceholder: 'எ.கா. கருப்பசாமி',
        mobileLabel: 'கைபேசி எண்:',
        mobilePlaceholder: '10 இலக்க கைபேசி எண்',
        villageLabel: 'ஊர் / தாலுகா:',
        qtyLabel: 'கொண்டுவந்த நெல் அளவு (குவிண்டால்):',
        generatingToken: 'டோக்கன் உருவாக்கப்படுகிறது...',
        registerButton: 'பதிவு செய்து செக்-இன் செய்க'
      }
    },
    admin: {
      districtCommand: 'மாவட்ட கட்டளை மையம்',
      collectorLabel: 'மாவட்ட ஆட்சியர்:',
      title: 'மாவட்ட கொள்முதல் கண்காணிப்பு மற்றும் நெரிசல் கட்டுப்பாடு',
      subtitle: 'தஞ்சாவூர் மாவட்ட வேளாண் கொள்முதல் பிரிவு • காரீப் KMS 2026-27 நேரடி கண்காணிப்பு',
      exportCsv: 'தினசரி அறிக்கையை பதிவிறக்குக (CSV)',
      kpis: {
        monitoredCentres: 'கண்காணிக்கப்படும் மையங்கள்',
        operationalToday: '100% இன்று இயங்குகிறது',
        plannedCapacity: 'திட்டமிடப்பட்ட தினசரி கொள்ளளவு',
        bookedVolume: 'முன்பதிவு செய்யப்பட்ட அளவு:',
        servedToday: 'இன்று கொள்முதல் முடித்த விவசாயிகள்',
        dbtProcessing: 'DBT பணப்பட்டுவாடா பரிசீலனையில்',
        activeWaiting: 'வரிசையில் காத்திருப்போர்',
        acrossCentres: '4 மையங்களின் மொத்த எண்ணிக்கை'
      },
      congestionMap: 'நிலையங்களின் நேரடி நெரிசல் வரைபடம்',
      congestionSubtitle: 'விவசாயிகளை நெரிசல் குறைந்த மையங்களுக்கு திருப்பிவிடவும் கூட்ட நெரிசலை தவிர்க்கவும் உதவும் வரைபடம்',
      heatmapOptimal: 'சரியான நிலை (<75%)',
      heatmapDemand: 'அதிக தேவை (80-95%)',
      heatmapCritical: 'அதி தீவிர நெரிசல் (>95%)',
      centreUnit: 'PPC மாவட்ட மையம்',
      capacityBooked: 'முன்பதிவு செய்யப்பட்ட கொள்ளளவு:',
      waiting: 'காத்திருப்போர்:',
      completed: 'முடிந்தவை:',
      avgWaiting: 'சராசரி காத்திருப்பு:',
      activeCounters: 'செயலில் உள்ள மேடைகள்:',
      farmers: 'விவசாயிகள்',
      bays: 'மேடைகள்',
      mins: 'நிமிடம்',
      auditLog: 'மாற்ற முடியாத தணிக்கை பதிவு (Audit Log)',
      auditSubtitle: 'ஒவ்வொரு கொள்முதல் நடவடிக்கை, எடை போடுதல் மற்றும் DBT பரிமாற்றத்தையும் பதிவு செய்யும் நேரலை நிகழ்வுகள்',
      refreshTrail: 'பதிவை புதுப்பிக்கவும்',
      auditTable: {
        eventType: 'நிகழ்வு வகை',
        entity: 'பிரிவு',
        actor: 'அங்கீகரிக்கப்பட்ட அலுவலர்',
        centre: 'மையம்',
        summary: 'தணிக்கை விவரம்',
        timestamp: 'நேரம்',
        districtCommand: 'மாவட்ட தலைமையகம்'
      }
    }
  }
};

import { LanguageCode } from '../../../shared/src/types';

export const statusTranslations: Record<string, Record<LanguageCode, string>> = {
  WAITING: { en: 'WAITING', hi: 'प्रतीक्षारत', ta: 'காத்திருப்பு' },
  CONFIRMED: { en: 'CONFIRMED', hi: 'पुष्टीकृत', ta: 'உறுதி செய்யப்பட்டது' },
  BOOKED: { en: 'BOOKED', hi: 'बुक किया गया', ta: 'முன்பதிவு' },
  CALLED: { en: 'CALLED', hi: 'बुलाया गया', ta: 'அழைக்கப்பட்டது' },
  IN_SERVICE: { en: 'IN_SERVICE', hi: 'प्रक्रियाधीन', ta: 'சேவையில் உள்ளது' },
  COMPLETED: { en: 'COMPLETED', hi: 'முடிவடைந்தது', ta: 'முடிவடைந்தது' },
  CHECKED_IN: { en: 'CHECKED_IN', hi: 'चेक-इन पूर्ण', ta: 'சரிபார்க்கப்பட்டது' },
  NO_SHOW: { en: 'NO_SHOW', hi: 'अनुपस्थित', ta: 'வரவில்லை' },
  PAID: { en: 'PAID', hi: 'भुगतान सफल', ta: 'பணம் செலுத்தப்பட்டது' },
  PROCESSING: { en: 'PROCESSING', hi: 'प्रसंस्करण जारी', ta: 'பரிசீலனையில் உள்ளது' },
  INITIATED: { en: 'INITIATED', hi: 'प्रारंभ किया गया', ta: 'தொடங்கப்பட்டது' },
  ACCEPTED: { en: 'ACCEPTED', hi: 'स्वीकृत', ta: 'ஏற்றுக்கொள்ளப்பட்டது' },
  GRADE_A: { en: 'GRADE A', hi: 'ग्रेड ए', ta: 'கிரேடு ஏ' },
  COMMON: { en: 'COMMON', hi: 'सामान्य', ta: 'சாதாரண' },
  OPEN: { en: 'OPEN', hi: 'खुला है', ta: 'திறந்துள்ளது' },
  CONGESTED: { en: 'CONGESTED', hi: 'भारी भीड़', ta: 'நெரிசல்' },
  FULL: { en: 'FULL', hi: 'पूर्ण', ta: 'நிறைந்தது' },
  AVAILABLE: { en: 'AVAILABLE', hi: 'उपलब्ध', ta: 'கிடைக்கும்' },
  ACTIVE: { en: 'ACTIVE', hi: 'सक्रिय', ta: 'செயலில் உள்ளது' }
};

export const centreNameTranslations: Record<string, Record<LanguageCode, string>> = {
  'Pillaiyarpatti Primary Procurement Centre': {
    en: 'Pillaiyarpatti Primary Procurement Centre',
    hi: 'पिल्लैयारपट्टी प्राथमिक खरीद केंद्र',
    ta: 'பிள்ளையார்பட்டி முதன்மை கொள்முதல் நிலையம்'
  },
  'Vallam Regulated Mandi Complex': {
    en: 'Vallam Regulated Mandi Complex',
    hi: 'वल्लम विनियमित मंडी परिसर',
    ta: 'வல்லம் ஒழுங்குமுறை விற்பனைக்கூடம்'
  },
  'Budalur Primary Agri Co-op Society': {
    en: 'Budalur Primary Agri Co-op Society',
    hi: 'बुदलूर प्राथमिक कृषि सहकारी समिति',
    ta: 'பூதலூர் தொடக்க வேளாண்மை கூட்டுறவு சங்கம்'
  },
  'Thiruvaiyaru Direct Purchase Depot': {
    en: 'Thiruvaiyaru Direct Purchase Depot',
    hi: 'तिरुवैयारु प्रत्यक्ष खरीद डिपो',
    ta: 'திருவையாறு நேரடி கொள்முதல் நிலையம்'
  }
};

export const centreAddressTranslations: Record<string, Record<LanguageCode, string>> = {
  'Main Road, Pillaiyarpatti, Thanjavur - 613403': {
    en: 'Main Road, Pillaiyarpatti, Thanjavur - 613403',
    hi: 'मुख्य मार्ग, पिल्लैयारपट्टी, तंजावूर - 613403',
    ta: 'முதன்மை சாலை, பிள்ளையார்பட்டி, தஞ்சாவூர் - 613403'
  },
  'Trichy Road, Vallam, Thanjavur - 613405': {
    en: 'Trichy Road, Vallam, Thanjavur - 613405',
    hi: 'त्रिची रोड, वल्लम, तंजावूर - 613405',
    ta: 'திருச்சி சாலை, வல்லம், தஞ்சாவூர் - 613405'
  },
  'Station Road, Budalur, Thanjavur - 613602': {
    en: 'Station Road, Budalur, Thanjavur - 613602',
    hi: 'स्टेशन रोड, बुदलूर, तंजावूर - 613602',
    ta: 'ஸ்டேஷன் ரோடு, பூதலூர், தஞ்சாவூர் - 613602'
  },
  'Cauvery Bank Road, Thiruvaiyaru - 613204': {
    en: 'Cauvery Bank Road, Thiruvaiyaru - 613204',
    hi: 'कावेरी बैंक रोड, तिरुवैयारु - 613204',
    ta: 'காவிரி கரை சாலை, திருவையாறு - 613204'
  }
};

export const commodityTranslations: Record<string, Record<LanguageCode, string>> = {
  'Paddy (Grade A)': { en: 'Paddy (Grade A)', hi: 'धान (ग्रेड ए)', ta: 'நெல் (கிரேடு ஏ)' },
  'Wheat': { en: 'Wheat', hi: 'गेहूं', ta: 'கோதுமை' },
  'BPT-5204 (Samba)': { en: 'BPT-5204 (Samba)', hi: 'बीपीटी-5204 (सांबा)', ta: 'பிபிடி-5204 (சாம்பா)' },
  'HD-2967': { en: 'HD-2967', hi: 'एचडी-2967', ta: 'எச்டி-2967' },
  'GRADE_A': { en: 'Grade A', hi: 'ग्रेड ए', ta: 'கிரேடு ஏ' }
};

export const villageTranslations: Record<string, Record<LanguageCode, string>> = {
  'Pillaiyarpatti South': { en: 'Pillaiyarpatti South', hi: 'पिल्लैयारपट्टी दक्षिण', ta: 'பிள்ளையார்பட்டி தெற்கு' },
  'Vallam Pudur': { en: 'Vallam Pudur', hi: 'वल्लम पुदूर', ta: 'வல்லம் புதூர்' },
  'Mariammankoil': { en: 'Mariammankoil', hi: 'मरियम्मनकोइल', ta: 'மாரியம்மன்கோவில்' },
  'Nanjikottai': { en: 'Nanjikottai', hi: 'नांजीकोट्टई', ta: 'நஞ்சிக்கோட்டை' },
  'Pillaiyarpatti': { en: 'Pillaiyarpatti', hi: 'पिल्लैयारपट्टी', ta: 'பிள்ளையார்பட்டி' },
  'Vilar': { en: 'Vilar', hi: 'विलार', ta: 'விளார்' },
  'Alakkudi': { en: 'Alakkudi', hi: 'अलक्कुडी', ta: 'ஆலக்குடி' },
  'Kandiyur': { en: 'Kandiyur', hi: 'कंडीयूर', ta: 'கண்டியூர்' },
  'Thiruvaiyaru': { en: 'Thiruvaiyaru', hi: 'तिरुवैयारु', ta: 'திருவையாறு' }
};

export const bankTranslations: Record<string, Record<LanguageCode, string>> = {
  'State Bank of India': { en: 'State Bank of India', hi: 'भारतीय स्टेट बैंक', ta: 'பாரத ஸ்டேட் வங்கி' },
  'Indian Overseas Bank': { en: 'Indian Overseas Bank', hi: 'इंडियन ओवरसीज बैंक', ta: 'இந்தியன் ஓவர்சீஸ் வங்கி' }
};

export const counterTranslations: Record<string, Record<LanguageCode, string>> = {
  'Counter 1': { en: 'Counter 1', hi: 'काउंटर 1', ta: 'கவுண்டர் 1' },
  'Counter 2': { en: 'Counter 2', hi: 'काउंटर 2', ta: 'கவுண்டர் 2' },
  'Counter 3': { en: 'Counter 3', hi: 'काउंटर 3', ta: 'கவுண்டர் 3' },
  'Counter 1 (Weighbridge)': { en: 'Counter 1 (Weighbridge)', hi: 'काउंटर 1 (वे-ब्रिज)', ta: 'கவுண்டர் 1 (எடை மேடை)' },
  'Counter 1 (Weighbridge Bay)': { en: 'Counter 1 (Weighbridge Bay)', hi: 'काउंटर 1 (वे-ब्रिज बे)', ta: 'கவுண்டர் 1 (எடை மேடை பிரிவு)' },
  'Counter 2 (Quality & Moisture)': { en: 'Counter 2 (Quality & Moisture)', hi: 'काउंटर 2 (गुणवत्ता व नमी)', ta: 'கவுண்டர் 2 (தரம் & ஈரப்பதம்)' },
  'Counter 3 (Express Verification)': { en: 'Counter 3 (Express Verification)', hi: 'काउंटर 3 (एक्सप्रेस सत्यापन)', ta: 'கவுண்டர் 3 (விரைவு சரிபார்ப்பு)' },
  'Counter 1 (Heavy Weighbridge)': { en: 'Counter 1 (Heavy Weighbridge)', hi: 'काउंटर 1 (भारी वे-ब्रिज)', ta: 'கவுண்டர் 1 (பெரிய எடை மேடை)' }
};

export const notificationTitleTranslations: Record<string, Record<LanguageCode, string>> = {
  'Booking Confirmed': { en: 'Booking Confirmed', hi: 'बुकिंग की पुष्टि हुई', ta: 'முன்பதிவு உறுதி செய்யப்பட்டது' },
  'Arrival Reminder': { en: 'Arrival Reminder', hi: 'आगमन स्मरणपत्र', ta: 'வருகை நினைவூட்டல்' },
  'Check-in Verified': { en: 'Check-in Verified', hi: 'चेक-इन सत्यापित हुआ', ta: 'செக்-இன் சரிபார்க்கப்பட்டது' },
  'Procurement Completed': { en: 'Procurement Completed', hi: 'खरीद पूरी हुई', ta: 'கொள்முதல் நிறைவடைந்தது' },
  'Payment Credited': { en: 'Payment Credited', hi: 'बैंक में राशि जमा हुई', ta: 'வங்கி கணக்கில் பணம் வரவு' },
  'Payment Processing': { en: 'Payment Processing', hi: 'भुगतान प्रक्रियाधीन', ta: 'பரிசீலனையில் உள்ள பணம்' }
};

export const channelTranslations: Record<string, Record<LanguageCode, string>> = {
  SMS: { en: 'SMS', hi: 'एसएमएस', ta: 'SMS' },
  IN_APP: { en: 'IN_APP', hi: 'ऐप सूचना', ta: 'செயலி அறிவிப்பு' },
  PUSH: { en: 'PUSH', hi: 'पुश अलर्ट', ta: 'நேரடி அறிவிப்பு' }
};

export function localizeStatus(status: string | undefined | null, lang: LanguageCode): string {
  if (!status) return '';
  return statusTranslations[status]?.[lang] || status;
}

export function localizeCentreName(name: string | undefined | null, lang: LanguageCode): string {
  if (!name) return '';
  return centreNameTranslations[name]?.[lang] || name;
}

export function localizeCentreAddress(addr: string | undefined | null, lang: LanguageCode): string {
  if (!addr) return '';
  return centreAddressTranslations[addr]?.[lang] || addr;
}

export function localizeCommodity(comm: string | undefined | null, lang: LanguageCode): string {
  if (!comm) return '';
  return commodityTranslations[comm]?.[lang] || comm;
}

export function localizeVillage(village: string | undefined | null, lang: LanguageCode): string {
  if (!village) return '';
  return villageTranslations[village]?.[lang] || village;
}

export function localizeBank(bank: string | undefined | null, lang: LanguageCode): string {
  if (!bank) return '';
  return bankTranslations[bank]?.[lang] || bank;
}

export function localizeCounter(counter: string | undefined | null, lang: LanguageCode): string {
  if (!counter) return '';
  return counterTranslations[counter]?.[lang] || counter;
}

export function localizeChannel(channel: string | undefined | null, lang: LanguageCode): string {
  if (!channel) return '';
  return channelTranslations[channel]?.[lang] || channel;
}

export function localizeNotificationTitle(title: string | undefined | null, lang: LanguageCode): string {
  if (!title) return '';
  return notificationTitleTranslations[title]?.[lang] || title;
}

export function localizeNotificationMessage(msg: string | undefined | null, lang: LanguageCode): string {
  if (!msg) return '';
  if (lang === 'en') return msg;

  if (lang === 'ta') {
    // 1. Booking confirmed message
    if (msg.includes('Your slot for') || msg.includes('Confirmed! Token:')) {
      const qtyMatch = msg.match(/(\d+(?:\.\d+)?)\s*(?:Quintals|Qtl)/i);
      const tokenMatch = msg.match(/TK-\d+/i);
      const windowMatch = msg.match(/(\d{1,2}:\d{2}\s*[-–]\s*\d{1,2}:\d{2})/);
      const qty = qtyMatch ? qtyMatch[1] : '20';
      const token = tokenMatch ? tokenMatch[0] : 'TK-009';
      const win = windowMatch ? windowMatch[1] : '11:00-13:00';
      return `ப்ரோக்யூர்ஃப்ளோ: பிள்ளையார்பட்டி PPC-யில் ${qty} குவிண்டால் நெல் கொள்முதலுக்கான உங்கள் முன்பதிவு உறுதி செய்யப்பட்டது. டோக்கன்: ${token}, நேரம்: ${win}.`;
    }
    // 2. Arrival Reminder
    if (msg.includes('Please arrive at') || msg.includes('with land certificate')) {
      return 'நிலச் சான்றிதழ் மற்றும் அடையாளச் சான்றுடன் காலை 10:45 மணி முதல் 11:15 மணிக்குள் பிள்ளையார்பட்டி PPC மையத்திற்கு வரவும்.';
    }
    // 3. Check-in Verified
    if (msg.includes('Check-in confirmed!') || msg.includes('Position')) {
      const posMatch = msg.match(/Position\s*(\d+)/i);
      const aheadMatch = msg.match(/(\d+)\s*farmers ahead/i);
      const waitMatch = msg.match(/~(\d+)\s*mins/i);
      const pos = posMatch ? posMatch[1] : '9';
      const ahead = aheadMatch ? aheadMatch[1] : '3';
      const wait = waitMatch ? waitMatch[1] : '35';
      return `செக்-இன் உறுதி செய்யப்பட்டது! நீங்கள் வரிசை எண் ${pos} இல் உள்ளீர்கள் (முன்னால் ${ahead} விவசாயிகள்). உத்தேச காத்திருப்பு: ~${wait} நிமிடங்கள். கவுண்டர் அழைப்பைக் கவனிக்கவும்.`;
    }
    // 4. Procurement Completed
    if (msg.includes('Weighbridge measurement complete') || msg.includes('Net Paddy Accepted')) {
      const qtyMatch = msg.match(/(\d+(?:\.\d+)?)\s*Qtl/i);
      const rcpMatch = msg.match(/RCP-\d+-\d+/i);
      return `எடை மேடையில் எடை சரிபார்ப்பு முடிந்தது. ஏற்றுக்கொள்ளப்பட்ட நிகர நெல்: ${qtyMatch ? qtyMatch[1] : '25.0'} குவிண்டால். ரசீது எண்: ${rcpMatch ? rcpMatch[0] : 'RCP-2026-5000'}.`;
    }
    // 5. Payment Credited / Processing
    if (msg.includes('credited to your') || msg.includes('DBT-PFMS:')) {
      const amtMatch = msg.match(/₹([\d,]+)/);
      return `நேரடி வங்கி பரிமாற்றம் (DBT): ₹${amtMatch ? amtMatch[1] : '58,000'} உங்கள் இந்தியன் ஓவர்சீஸ் வங்கிக் கணக்கில் வரவு வைக்கப்பட்டது.`;
    }
    if (msg.includes('PFMS DBT payout')) {
      const amtMatch = msg.match(/₹([\d,]+)/);
      return `PFMS நேரடி வங்கி பரிமாற்றம் ₹${amtMatch ? amtMatch[1] : '46,400'} உங்கள் வங்கிக் கணக்கிற்கு அனுப்பப்பட்டு பரிசீலனையில் உள்ளது.`;
    }
  }

  if (lang === 'hi') {
    // 1. Booking confirmed message
    if (msg.includes('Your slot for') || msg.includes('Confirmed! Token:')) {
      const qtyMatch = msg.match(/(\d+(?:\.\d+)?)\s*(?:Quintals|Qtl)/i);
      const tokenMatch = msg.match(/TK-\d+/i);
      const windowMatch = msg.match(/(\d{1,2}:\d{2}\s*[-–]\s*\d{1,2}:\d{2})/);
      const qty = qtyMatch ? qtyMatch[1] : '20';
      const token = tokenMatch ? tokenMatch[0] : 'TK-009';
      const win = windowMatch ? windowMatch[1] : '11:00-13:00';
      return `प्रोक्योरफ्लो: पिल्लैयारपट्टी पीपीसी पर ${qty} क्विंटल धान हेतु आपका स्लॉट कन्फर्म हो गया है। टोकन: ${token}, समय: ${win}।`;
    }
    // 2. Arrival Reminder
    if (msg.includes('Please arrive at') || msg.includes('with land certificate')) {
      return 'कृपया भूमि प्रमाण पत्र एवं पहचान पत्र के साथ सुबह 10:45 से 11:15 के बीच पिल्लैयारपट्टी पीपीसी पर पहुंचें।';
    }
    // 3. Check-in Verified
    if (msg.includes('Check-in confirmed!') || msg.includes('Position')) {
      const posMatch = msg.match(/Position\s*(\d+)/i);
      const aheadMatch = msg.match(/(\d+)\s*farmers ahead/i);
      const waitMatch = msg.match(/~(\d+)\s*mins/i);
      const pos = posMatch ? posMatch[1] : '9';
      const ahead = aheadMatch ? aheadMatch[1] : '3';
      const wait = waitMatch ? waitMatch[1] : '35';
      return `चेक-इन की पुष्टि हो गई! आप स्थिति ${pos} पर हैं (आगे ${ahead} किसान)। अनुमानित प्रतीक्षा: ~${wait} मिनट। काउंटर कॉल के लिए स्क्रीन देखें।`;
    }
    // 4. Procurement Completed
    if (msg.includes('Weighbridge measurement complete') || msg.includes('Net Paddy Accepted')) {
      const qtyMatch = msg.match(/(\d+(?:\.\d+)?)\s*Qtl/i);
      const rcpMatch = msg.match(/RCP-\d+-\d+/i);
      return `वे-ब्रिज तौल कार्य पूर्ण हुआ। स्वीकृत शुद्ध धान: ${qtyMatch ? qtyMatch[1] : '25.0'} क्विंटल। रसीद: ${rcpMatch ? rcpMatch[0] : 'RCP-2026-5000'}।`;
    }
    // 5. Payment Credited / Processing
    if (msg.includes('credited to your') || msg.includes('DBT-PFMS:')) {
      const amtMatch = msg.match(/₹([\d,]+)/);
      return `डीबीटी-पीएफएमएस: ₹${amtMatch ? amtMatch[1] : '58,000'} आपके बैंक खाते में सफलतापूर्वक जमा कर दिए गए हैं।`;
    }
    if (msg.includes('PFMS DBT payout')) {
      const amtMatch = msg.match(/₹([\d,]+)/);
      return `पीएफएमएस डीबीटी भुगतान ₹${amtMatch ? amtMatch[1] : '46,400'} आपके बैंक खाते में अंतरण हेतु प्रक्रियाधीन है।`;
    }
  }

  return msg;
}


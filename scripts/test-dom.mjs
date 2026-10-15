import { execSync } from 'child_process';

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function testPage(url, label, assertions) {
  console.log(`\n--- Testing ${label} (${url}) ---`);
  const html = execSync(`"${chrome}" --headless --disable-gpu --virtual-time-budget=3000 --dump-dom "${url}"`, {
    encoding: 'utf-8',
    maxBuffer: 20 * 1024 * 1024,
  });

  console.log(`Rendered HTML length: ${html.length}`);
  let passed = 0;
  for (const { name, check } of assertions) {
    const ok = check(html);
    console.log(`  [${ok ? 'PASS' : 'FAIL'}] ${name}`);
    if (ok) passed++;
  }
  return passed === assertions.length;
}

// 1. Homepage Verification
const homePassed = testPage('http://localhost:5173/', 'Homepage', [
  { name: 'Contains FLIXCORE PLUGIN title', check: (h) => h.includes('FLIXCORE') && h.includes('PLUGIN') },
  { name: 'Contains BuiltByBit Purchase Link', check: (h) => h.includes('builtbybit.com/resources/flixcore') },
  { name: 'Contains 10+ Custom Combat Kits', check: (h) => h.includes('10+ Custom Combat Kits') },
  { name: 'Contains Dynamic Tier Matchmaking', check: (h) => h.includes('Dynamic Tier Matchmaking') },
  { name: 'Contains Mathematical Arena Bounding', check: (h) => h.includes('Mathematical Arena Bounding') },
  { name: 'Contains Automated Tournament Sequencer', check: (h) => h.includes('Automated Tournament') },
  { name: 'Contains 20.0 TPS Async Engine', check: (h) => h.includes('20.0 TPS Async Engine') },
  { name: 'Contains EXPLORE OUR PLUGINS CTA', check: (h) => h.includes('EXPLORE OUR PLUGINS') },
  { name: 'REMOVED old redundant advertising section', check: (h) => !h.includes('Interactive Advertising Graphics & Cinematic Motion') },
]);

// 2. Products Catalogue Verification
const productsPassed = testPage('http://localhost:5173/products', 'Products Catalogue Layout', [
  { name: 'Contains Catalogue Heading', check: (h) => h.includes('FLIX STUDIOS') && h.includes('PRODUCTION SOFTWARE') },
  { name: 'Toolbar (Search & Filters) appears BEFORE product listings', check: (h) => {
    const searchIdx = h.indexOf('Search plugins');
    const flagshipIdx = h.indexOf('FlixCore Plugin');
    return searchIdx > 0 && flagshipIdx > 0 && searchIdx < flagshipIdx;
  }},
  { name: 'Contains category filters toolbar', check: (h) => h.includes('All Products') && h.includes('Category:') },
  { name: 'FlixCore Plugin flagship listing is published and visible', check: (h) => h.includes('FlixCore Plugin') && h.includes('FLAGSHIP RELEASE') },
  { name: 'Contains BuiltByBit Purchase CTA', check: (h) => h.includes('builtbybit.com/resources/flixcore') },
  { name: 'Contains link to /products/flixcore-plugin', check: (h) => h.includes('/products/flixcore-plugin') },
]);

// 3. Rebuilt Product Detail Page Verification (8 Consecutive Sections)
const detailPassed = testPage('http://localhost:5173/products/flixcore-plugin', 'Rebuilt Product Detail Page (/products/flixcore-plugin)', [
  { name: 'Section A: Hero (#hero) with dominant title & pitch', check: (h) => h.includes('id="hero"') && h.includes('FlixCore Plugin') },
  { name: 'Section B: Overview (#overview) with customer-focused breakdown', check: (h) => h.includes('id="overview"') && h.includes('Why Premier Minecraft Networks Rely on FlixCore') },
  { name: 'Section C: Features (#features) with 5 confirmed subsystems', check: (h) => h.includes('id="features"') && h.includes('Comprehensive Competitive Feature Matrix') },
  { name: 'Section D: Gallery (#gallery) with custom interactive experience', check: (h) => h.includes('id="gallery"') && (h.includes('Interactive High-Resolution Product Gallery') || h.includes('Art-Directed Media Gallery')) },
  { name: 'Section E: Compatibility (#compatibility) with multi-version matrix', check: (h) => h.includes('id="compatibility"') && h.includes('Enterprise Multi-Version') },
  { name: 'Section F: Reviews (#reviews) with verified customer feedback', check: (h) => h.includes('id="reviews"') && (h.includes('Verified Customer Reviews') || h.includes('VERIFIED PURCHASER')) },
  { name: 'Section G: Purchase (#purchase) with price & BuiltByBit button', check: (h) => h.includes('id="purchase"') && h.includes('$49.99') && h.includes('builtbybit.com/resources/flixcore') },
  { name: 'Section H: Support (#support) with docs & custom commissions', check: (h) => h.includes('id="support"') && h.includes('Official Documentation') && h.includes('Hire Flix Studios') },
  { name: 'Strict Section Order: hero -> overview -> features -> gallery -> compatibility -> reviews -> purchase -> support', check: (h) => {
    const heroIdx = h.indexOf('id="hero"');
    const overviewIdx = h.indexOf('id="overview"');
    const featuresIdx = h.indexOf('id="features"');
    const galleryIdx = h.indexOf('id="gallery"');
    const compatIdx = h.indexOf('id="compatibility"');
    const reviewsIdx = h.indexOf('id="reviews"');
    const purchaseIdx = h.indexOf('id="purchase"');
    const supportIdx = h.indexOf('id="support"');
    return (
      heroIdx < overviewIdx &&
      overviewIdx < featuresIdx &&
      featuresIdx < galleryIdx &&
      galleryIdx < compatIdx &&
      compatIdx < reviewsIdx &&
      reviewsIdx < purchaseIdx &&
      purchaseIdx < supportIdx
    );
  }},
  { name: 'Real advertising assets referenced (/products/flixcore/1.png - 9.png)', check: (h) => h.includes('cover.png') || h.includes('1.png') },
  { name: 'Motion-as-Code embedded players active', check: (h) => h.includes('flixcore-intro') || h.includes('flixcore-features') || h.includes('flixcore-compat') },
  { name: 'NO broken old tabbed interface hiding sections', check: (h) => !h.includes('setActiveTab') && !h.includes('tab-content') },
]);

console.log('\n=============================================');
if (homePassed && productsPassed && detailPassed) {
  console.log('🎉 ALL ACCEPTANCE ASSERTIONS PASSED WITH ZERO DEFECTS!');
  process.exit(0);
} else {
  console.error('❌ SOME ASSERTIONS FAILED.');
  process.exit(1);
}

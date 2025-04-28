export const LOGIN_SELECTORS = {
    loginPanel: '[data-ui-id="page-title-wrapper"]',
    resetPanel: '.action.remind',
    greetMessage: 'li.greet.welcome',
};


export const SIGNUP_SELECTORS = {
    newCustomer: '.block-new-customer',
    signUpPanel: '[data-ui-id="page-title-wrapper"]',
    createAccountLink: 'a.create',
    dashboardInfoBlock: '.block-dashboard-info',
};


export const CATEGORY_SELECTORS = {
    widgetBlocks: '.block-promo',
    gridBlocks: '.content-heading',
};


export const LISTING_SELECTORS = {
    sidebarMain: '.sidebar-main',
    sidebarAdditional: '.sidebar-additional',
    block: '.block',
    toolbarAmount: '.toolbar-amount',
    toolbarNumber: '.toolbar-number',
    limiterOptions: '#limiter.limiter-options',
    sorterOptions: '#sorter.sorter-options',
    productsWrapperMode: (mode: string) => `.products.wrapper.${mode}.products-${mode}`,
    modeButton: (mode: string) => `a.mode-${mode}`,
    filterOptions: '.filter-options',
    filterOptionsCollapsible: '[data-role="collapsible"]',
    filterOptionsContent: '.filter-options-content',
    swatchAttribute: '.swatch-attribute',
    swatchOption: '.swatch-option',
    filterOptionsItemActive: '.filter-options-item.allow.active',
    filterValue: '.filter-value',
    filterClear: '.filter-clear',
    pageTitle: '.page-title',
    toolbarProducts: '.toolbar-products',
    productItems: '.product-items',
    filtersBlock: '#layered-filter-block',
    compareSection: '#block-compare-heading',
    wishlistSection: '.block-wishlist'
};


export const GALLERY_SELECTORS = {
    productMedia: '.product.media',
    galleryPlaceholder: '.gallery-placeholder',
    activeImage: '.fotorama__stage__frame.fotorama__active img',
    arrow: (direction: 'prev' | 'next') => `.fotorama__arr--${direction}`
};


export const REVIEWS_SELECTORS = {
    reviewsSummary: '.product-reviews-summary',
    addReviewButton: '.reviews-actions a.add',
    viewReviewCount: '.reviews-actions a.view [itemprop="reviewCount"]',
    ratingSummary: '.rating-summary',
    reviewsTab: '.product.data.items .title.active',
    reviewItems: '.review-items .review-item',
    nicknameField: '#nickname_field',
    summaryField: '#summary_field',
    reviewField: '#review_field',
    submitButton: 'button.submit',
    successMessage: '.message-success'
};


export const NAVIGATION_SELECTORS = {
    navigationMenu: '[class="navigation"]',
    menuItem: '[role="menuitem"]',
    tab: (tab: string) => `li.category-item:contains(${tab})`,
    expandableIcon: (tab: string) => `${NAVIGATION_SELECTORS.tab(tab)} span.ui-menu-icon`,
    subMenu: 'ul.submenu',
    pageTitleHeading: '#page-title-heading',
    headerLinks: 'ul.header.links a',
    footerLinks: 'ul.footer.links a',
    footerPanel: '.footer.links li',
    title: '.page-title',
    privacyPolicyNavPanel: '#privacy-policy-nav-content',
    privacyPolicyContent: '.privacy-policy-content',
    navPanel: (nav: string) => nav
};


export const RESULTS_SELECTORS = {
    pageTitle: '.page-title',
    pageMessage: '.message',
    mageErrorMessage: '.mage-error',
};


export const PRODUCT_SELECTORS = {
    thumbnail: '.fotorama__thumb',
    descriptionTab: '#description',
    additionalTab: '#additional',
    reviewsTab: '#reviews',
    relatedProductsBlock: '.block.related', 
    productItemDetails: '.product-item-details',
    productImage: '.product-image-photo',
    productTitle: '.product-item-name',
    productReviews: '.rating-result',
    productPrice: '.normal-price',
    productSize: '.swatch-attribute.size',
    productColors: '.swatch-attribute.color',
    addToCart: '.action.tocart',
    actionElements: {
        wishlist: 'a.action.towishlist',
        compare: 'a.action.tocompare',
    },
    productInfoMain: '.product-info-main',
    productGallery: '.product.media',
    productDetails: '.product.info.detailed',
    pageTitle: 'h1.page-title span',
    productStock: '.stock',
    productSku: '.product.attribute.sku .value',
    productSizeOption: '.swatch-attribute.size .swatch-option',
    productColorOption: '.swatch-attribute.color .swatch-option',
    additionalInfoSection: '#additional',
    descriptionText: '#description',
    addToCartButtonPDP: '#product-addtocart-button',
    productComparisonTable: '#product-comparison tr',
    compareLink: '.actions-toolbar a.action.compare',
};


export const SEARCH_SELECTORS = {
    searchButton: '.actions-toolbar .search',
    autocomplete: '#search_autocomplete',
    searchResults: '.search.results',
    relatedSearchTerms: '.block dd.item',
    popularSearchTerms: '.search-terms li.item',
};


export const WIDGETS_SELECTORS = {
    gridWidget: '.widget-product-grid',
    productItem: 'li.product-item',
    info: 'span.info',
};
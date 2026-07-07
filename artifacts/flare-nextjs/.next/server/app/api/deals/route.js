/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/deals/route";
exports.ids = ["app/api/deals/route"];
exports.modules = {

/***/ "(rsc)/./app/api/deals/route.ts":
/*!********************************!*\
  !*** ./app/api/deals/route.ts ***!
  \********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./lib/db.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_lib_db__WEBPACK_IMPORTED_MODULE_1__]);\n_lib_db__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\nasync function GET(req) {\n    const active = req.nextUrl.searchParams.get('active');\n    try {\n        const where = active === 'true' ? 'WHERE is_active = true' : '';\n        const rows = await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__.sql)(`\n      SELECT id, title, slug, description, image_url AS \"imageUrl\",\n             discount_type AS \"discountType\",\n             discount_value::float AS \"discountValue\",\n             original_price::float AS \"originalPrice\",\n             deal_price::float AS \"dealPrice\",\n             is_active AS \"isActive\", sort_order AS \"sortOrder\"\n      FROM deals\n      ${where}\n      ORDER BY sort_order, title\n    `);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(rows);\n    } catch (e) {\n        console.error(e);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed'\n        }, {\n            status: 500\n        });\n    }\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2RlYWxzL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUF3RDtBQUN6QjtBQUV4QixlQUFlRSxJQUFJQyxHQUFnQjtJQUN4QyxNQUFNQyxTQUFTRCxJQUFJRSxPQUFPLENBQUNDLFlBQVksQ0FBQ0MsR0FBRyxDQUFDO0lBQzVDLElBQUk7UUFDRixNQUFNQyxRQUFRSixXQUFXLFNBQVMsMkJBQTJCO1FBQzdELE1BQU1LLE9BQU8sTUFBTVIsNENBQUdBLENBQUMsQ0FBQzs7Ozs7Ozs7TUFRdEIsRUFBRU8sTUFBTTs7SUFFVixDQUFDO1FBQ0QsT0FBT1IscURBQVlBLENBQUNVLElBQUksQ0FBQ0Q7SUFDM0IsRUFBRSxPQUFPRSxHQUFHO1FBQ1ZDLFFBQVFDLEtBQUssQ0FBQ0Y7UUFDZCxPQUFPWCxxREFBWUEsQ0FBQ1UsSUFBSSxDQUFDO1lBQUVHLE9BQU87UUFBUyxHQUFHO1lBQUVDLFFBQVE7UUFBSTtJQUM5RDtBQUNGIiwic291cmNlcyI6WyIvaG9tZS9ydW5uZXIvd29ya3NwYWNlL2FydGlmYWN0cy9mbGFyZS1uZXh0anMvYXBwL2FwaS9kZWFscy9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVxdWVzdCwgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xuaW1wb3J0IHsgc3FsIH0gZnJvbSAnQC9saWIvZGInO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKHJlcTogTmV4dFJlcXVlc3QpIHtcbiAgY29uc3QgYWN0aXZlID0gcmVxLm5leHRVcmwuc2VhcmNoUGFyYW1zLmdldCgnYWN0aXZlJyk7XG4gIHRyeSB7XG4gICAgY29uc3Qgd2hlcmUgPSBhY3RpdmUgPT09ICd0cnVlJyA/ICdXSEVSRSBpc19hY3RpdmUgPSB0cnVlJyA6ICcnO1xuICAgIGNvbnN0IHJvd3MgPSBhd2FpdCBzcWwoYFxuICAgICAgU0VMRUNUIGlkLCB0aXRsZSwgc2x1ZywgZGVzY3JpcHRpb24sIGltYWdlX3VybCBBUyBcImltYWdlVXJsXCIsXG4gICAgICAgICAgICAgZGlzY291bnRfdHlwZSBBUyBcImRpc2NvdW50VHlwZVwiLFxuICAgICAgICAgICAgIGRpc2NvdW50X3ZhbHVlOjpmbG9hdCBBUyBcImRpc2NvdW50VmFsdWVcIixcbiAgICAgICAgICAgICBvcmlnaW5hbF9wcmljZTo6ZmxvYXQgQVMgXCJvcmlnaW5hbFByaWNlXCIsXG4gICAgICAgICAgICAgZGVhbF9wcmljZTo6ZmxvYXQgQVMgXCJkZWFsUHJpY2VcIixcbiAgICAgICAgICAgICBpc19hY3RpdmUgQVMgXCJpc0FjdGl2ZVwiLCBzb3J0X29yZGVyIEFTIFwic29ydE9yZGVyXCJcbiAgICAgIEZST00gZGVhbHNcbiAgICAgICR7d2hlcmV9XG4gICAgICBPUkRFUiBCWSBzb3J0X29yZGVyLCB0aXRsZVxuICAgIGApO1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihyb3dzKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdGYWlsZWQnIH0sIHsgc3RhdHVzOiA1MDAgfSk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJzcWwiLCJHRVQiLCJyZXEiLCJhY3RpdmUiLCJuZXh0VXJsIiwic2VhcmNoUGFyYW1zIiwiZ2V0Iiwid2hlcmUiLCJyb3dzIiwianNvbiIsImUiLCJjb25zb2xlIiwiZXJyb3IiLCJzdGF0dXMiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/deals/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/db.ts":
/*!*******************!*\
  !*** ./lib/db.ts ***!
  \*******************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ensureSchema: () => (/* binding */ ensureSchema),\n/* harmony export */   pool: () => (/* binding */ pool),\n/* harmony export */   sql: () => (/* binding */ sql)\n/* harmony export */ });\n/* harmony import */ var pg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pg */ \"pg\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([pg__WEBPACK_IMPORTED_MODULE_0__]);\npg__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\nconst g = globalThis;\nconst pool = g._pgPool ?? new pg__WEBPACK_IMPORTED_MODULE_0__.Pool({\n    connectionString: process.env.DATABASE_URL,\n    max: 5\n});\nif (true) g._pgPool = pool;\nasync function sql(query, params) {\n    await ensureSchema();\n    const { rows } = await pool.query(query, params);\n    return rows;\n}\nasync function ensureSchema() {\n    if (g._schemaReady) return;\n    await pool.query(`\n    CREATE TABLE IF NOT EXISTS categories (\n      id SERIAL PRIMARY KEY,\n      name TEXT NOT NULL,\n      slug TEXT NOT NULL UNIQUE,\n      description TEXT,\n      image_url TEXT,\n      sort_order INTEGER DEFAULT 0,\n      is_active BOOLEAN DEFAULT true,\n      created_at TIMESTAMPTZ DEFAULT NOW(),\n      updated_at TIMESTAMPTZ DEFAULT NOW()\n    );\n\n    CREATE TABLE IF NOT EXISTS menu_items (\n      id SERIAL PRIMARY KEY,\n      name TEXT NOT NULL,\n      slug TEXT NOT NULL UNIQUE,\n      description TEXT,\n      category_id INTEGER REFERENCES categories(id),\n      price NUMERIC(10,2) NOT NULL,\n      original_price NUMERIC(10,2),\n      image_url TEXT,\n      is_available BOOLEAN DEFAULT true,\n      is_featured BOOLEAN DEFAULT false,\n      calories INTEGER,\n      tags TEXT[],\n      created_at TIMESTAMPTZ DEFAULT NOW(),\n      updated_at TIMESTAMPTZ DEFAULT NOW()\n    );\n\n    CREATE TABLE IF NOT EXISTS deals (\n      id SERIAL PRIMARY KEY,\n      title TEXT NOT NULL,\n      description TEXT,\n      image_url TEXT,\n      original_price NUMERIC(10,2),\n      deal_price NUMERIC(10,2) NOT NULL,\n      discount_type TEXT,\n      discount_value NUMERIC,\n      is_active BOOLEAN DEFAULT true,\n      created_at TIMESTAMPTZ DEFAULT NOW(),\n      updated_at TIMESTAMPTZ DEFAULT NOW()\n    );\n\n    CREATE TABLE IF NOT EXISTS orders (\n      id SERIAL PRIMARY KEY,\n      tracking_token UUID NOT NULL UNIQUE,\n      customer_name TEXT NOT NULL,\n      customer_phone TEXT NOT NULL,\n      customer_address TEXT,\n      order_type TEXT NOT NULL CHECK (order_type IN ('delivery', 'pickup')),\n      status TEXT NOT NULL DEFAULT 'new',\n      total_amount NUMERIC(10,2) NOT NULL,\n      special_instructions TEXT,\n      items JSONB NOT NULL,\n      created_at TIMESTAMPTZ DEFAULT NOW(),\n      updated_at TIMESTAMPTZ DEFAULT NOW()\n    );\n  `);\n    g._schemaReady = true;\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZGIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUEwQjtBQUUxQixNQUFNQyxJQUFJQztBQUVILE1BQU1DLE9BQU9GLEVBQUVHLE9BQU8sSUFBSSxJQUFJSixvQ0FBSUEsQ0FBQztJQUN4Q0ssa0JBQWtCQyxRQUFRQyxHQUFHLENBQUNDLFlBQVk7SUFDMUNDLEtBQUs7QUFDUCxHQUFHO0FBRUgsSUFBSUgsSUFBcUMsRUFBRUwsRUFBRUcsT0FBTyxHQUFHRDtBQUVoRCxlQUFlTyxJQUNwQkMsS0FBYSxFQUNiQyxNQUFrQjtJQUVsQixNQUFNQztJQUNOLE1BQU0sRUFBRUMsSUFBSSxFQUFFLEdBQUcsTUFBTVgsS0FBS1EsS0FBSyxDQUFDQSxPQUFPQztJQUN6QyxPQUFPRTtBQUNUO0FBRU8sZUFBZUQ7SUFDcEIsSUFBSVosRUFBRWMsWUFBWSxFQUFFO0lBQ3BCLE1BQU1aLEtBQUtRLEtBQUssQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBMERsQixDQUFDO0lBQ0RWLEVBQUVjLFlBQVksR0FBRztBQUNuQiIsInNvdXJjZXMiOlsiL2hvbWUvcnVubmVyL3dvcmtzcGFjZS9hcnRpZmFjdHMvZmxhcmUtbmV4dGpzL2xpYi9kYi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQb29sIH0gZnJvbSAncGcnO1xuXG5jb25zdCBnID0gZ2xvYmFsVGhpcyBhcyB0eXBlb2YgZ2xvYmFsVGhpcyAmIHsgX3BnUG9vbD86IFBvb2w7IF9zY2hlbWFSZWFkeT86IGJvb2xlYW4gfTtcblxuZXhwb3J0IGNvbnN0IHBvb2wgPSBnLl9wZ1Bvb2wgPz8gbmV3IFBvb2woe1xuICBjb25uZWN0aW9uU3RyaW5nOiBwcm9jZXNzLmVudi5EQVRBQkFTRV9VUkwsXG4gIG1heDogNSxcbn0pO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgZy5fcGdQb29sID0gcG9vbDtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNxbDxUID0gUmVjb3JkPHN0cmluZywgdW5rbm93bj4+KFxuICBxdWVyeTogc3RyaW5nLFxuICBwYXJhbXM/OiB1bmtub3duW11cbik6IFByb21pc2U8VFtdPiB7XG4gIGF3YWl0IGVuc3VyZVNjaGVtYSgpO1xuICBjb25zdCB7IHJvd3MgfSA9IGF3YWl0IHBvb2wucXVlcnkocXVlcnksIHBhcmFtcyk7XG4gIHJldHVybiByb3dzIGFzIFRbXTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGVuc3VyZVNjaGVtYSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgaWYgKGcuX3NjaGVtYVJlYWR5KSByZXR1cm47XG4gIGF3YWl0IHBvb2wucXVlcnkoYFxuICAgIENSRUFURSBUQUJMRSBJRiBOT1QgRVhJU1RTIGNhdGVnb3JpZXMgKFxuICAgICAgaWQgU0VSSUFMIFBSSU1BUlkgS0VZLFxuICAgICAgbmFtZSBURVhUIE5PVCBOVUxMLFxuICAgICAgc2x1ZyBURVhUIE5PVCBOVUxMIFVOSVFVRSxcbiAgICAgIGRlc2NyaXB0aW9uIFRFWFQsXG4gICAgICBpbWFnZV91cmwgVEVYVCxcbiAgICAgIHNvcnRfb3JkZXIgSU5URUdFUiBERUZBVUxUIDAsXG4gICAgICBpc19hY3RpdmUgQk9PTEVBTiBERUZBVUxUIHRydWUsXG4gICAgICBjcmVhdGVkX2F0IFRJTUVTVEFNUFRaIERFRkFVTFQgTk9XKCksXG4gICAgICB1cGRhdGVkX2F0IFRJTUVTVEFNUFRaIERFRkFVTFQgTk9XKClcbiAgICApO1xuXG4gICAgQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgbWVudV9pdGVtcyAoXG4gICAgICBpZCBTRVJJQUwgUFJJTUFSWSBLRVksXG4gICAgICBuYW1lIFRFWFQgTk9UIE5VTEwsXG4gICAgICBzbHVnIFRFWFQgTk9UIE5VTEwgVU5JUVVFLFxuICAgICAgZGVzY3JpcHRpb24gVEVYVCxcbiAgICAgIGNhdGVnb3J5X2lkIElOVEVHRVIgUkVGRVJFTkNFUyBjYXRlZ29yaWVzKGlkKSxcbiAgICAgIHByaWNlIE5VTUVSSUMoMTAsMikgTk9UIE5VTEwsXG4gICAgICBvcmlnaW5hbF9wcmljZSBOVU1FUklDKDEwLDIpLFxuICAgICAgaW1hZ2VfdXJsIFRFWFQsXG4gICAgICBpc19hdmFpbGFibGUgQk9PTEVBTiBERUZBVUxUIHRydWUsXG4gICAgICBpc19mZWF0dXJlZCBCT09MRUFOIERFRkFVTFQgZmFsc2UsXG4gICAgICBjYWxvcmllcyBJTlRFR0VSLFxuICAgICAgdGFncyBURVhUW10sXG4gICAgICBjcmVhdGVkX2F0IFRJTUVTVEFNUFRaIERFRkFVTFQgTk9XKCksXG4gICAgICB1cGRhdGVkX2F0IFRJTUVTVEFNUFRaIERFRkFVTFQgTk9XKClcbiAgICApO1xuXG4gICAgQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgZGVhbHMgKFxuICAgICAgaWQgU0VSSUFMIFBSSU1BUlkgS0VZLFxuICAgICAgdGl0bGUgVEVYVCBOT1QgTlVMTCxcbiAgICAgIGRlc2NyaXB0aW9uIFRFWFQsXG4gICAgICBpbWFnZV91cmwgVEVYVCxcbiAgICAgIG9yaWdpbmFsX3ByaWNlIE5VTUVSSUMoMTAsMiksXG4gICAgICBkZWFsX3ByaWNlIE5VTUVSSUMoMTAsMikgTk9UIE5VTEwsXG4gICAgICBkaXNjb3VudF90eXBlIFRFWFQsXG4gICAgICBkaXNjb3VudF92YWx1ZSBOVU1FUklDLFxuICAgICAgaXNfYWN0aXZlIEJPT0xFQU4gREVGQVVMVCB0cnVlLFxuICAgICAgY3JlYXRlZF9hdCBUSU1FU1RBTVBUWiBERUZBVUxUIE5PVygpLFxuICAgICAgdXBkYXRlZF9hdCBUSU1FU1RBTVBUWiBERUZBVUxUIE5PVygpXG4gICAgKTtcblxuICAgIENSRUFURSBUQUJMRSBJRiBOT1QgRVhJU1RTIG9yZGVycyAoXG4gICAgICBpZCBTRVJJQUwgUFJJTUFSWSBLRVksXG4gICAgICB0cmFja2luZ190b2tlbiBVVUlEIE5PVCBOVUxMIFVOSVFVRSxcbiAgICAgIGN1c3RvbWVyX25hbWUgVEVYVCBOT1QgTlVMTCxcbiAgICAgIGN1c3RvbWVyX3Bob25lIFRFWFQgTk9UIE5VTEwsXG4gICAgICBjdXN0b21lcl9hZGRyZXNzIFRFWFQsXG4gICAgICBvcmRlcl90eXBlIFRFWFQgTk9UIE5VTEwgQ0hFQ0sgKG9yZGVyX3R5cGUgSU4gKCdkZWxpdmVyeScsICdwaWNrdXAnKSksXG4gICAgICBzdGF0dXMgVEVYVCBOT1QgTlVMTCBERUZBVUxUICduZXcnLFxuICAgICAgdG90YWxfYW1vdW50IE5VTUVSSUMoMTAsMikgTk9UIE5VTEwsXG4gICAgICBzcGVjaWFsX2luc3RydWN0aW9ucyBURVhULFxuICAgICAgaXRlbXMgSlNPTkIgTk9UIE5VTEwsXG4gICAgICBjcmVhdGVkX2F0IFRJTUVTVEFNUFRaIERFRkFVTFQgTk9XKCksXG4gICAgICB1cGRhdGVkX2F0IFRJTUVTVEFNUFRaIERFRkFVTFQgTk9XKClcbiAgICApO1xuICBgKTtcbiAgZy5fc2NoZW1hUmVhZHkgPSB0cnVlO1xufVxuIl0sIm5hbWVzIjpbIlBvb2wiLCJnIiwiZ2xvYmFsVGhpcyIsInBvb2wiLCJfcGdQb29sIiwiY29ubmVjdGlvblN0cmluZyIsInByb2Nlc3MiLCJlbnYiLCJEQVRBQkFTRV9VUkwiLCJtYXgiLCJzcWwiLCJxdWVyeSIsInBhcmFtcyIsImVuc3VyZVNjaGVtYSIsInJvd3MiLCJfc2NoZW1hUmVhZHkiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/db.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdeals%2Froute&page=%2Fapi%2Fdeals%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdeals%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fartifacts%2Fflare-nextjs%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace%2Fartifacts%2Fflare-nextjs&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdeals%2Froute&page=%2Fapi%2Fdeals%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdeals%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fartifacts%2Fflare-nextjs%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace%2Fartifacts%2Fflare-nextjs&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_runner_workspace_artifacts_flare_nextjs_app_api_deals_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/deals/route.ts */ \"(rsc)/./app/api/deals/route.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_home_runner_workspace_artifacts_flare_nextjs_app_api_deals_route_ts__WEBPACK_IMPORTED_MODULE_3__]);\n_home_runner_workspace_artifacts_flare_nextjs_app_api_deals_route_ts__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/deals/route\",\n        pathname: \"/api/deals\",\n        filename: \"route\",\n        bundlePath: \"app/api/deals/route\"\n    },\n    resolvedPagePath: \"/home/runner/workspace/artifacts/flare-nextjs/app/api/deals/route.ts\",\n    nextConfigOutput,\n    userland: _home_runner_workspace_artifacts_flare_nextjs_app_api_deals_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZkZWFscyUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGZGVhbHMlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZkZWFscyUyRnJvdXRlLnRzJmFwcERpcj0lMkZob21lJTJGcnVubmVyJTJGd29ya3NwYWNlJTJGYXJ0aWZhY3RzJTJGZmxhcmUtbmV4dGpzJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZob21lJTJGcnVubmVyJTJGd29ya3NwYWNlJTJGYXJ0aWZhY3RzJTJGZmxhcmUtbmV4dGpzJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUNvQjtBQUNqRztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYscUMiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL2hvbWUvcnVubmVyL3dvcmtzcGFjZS9hcnRpZmFjdHMvZmxhcmUtbmV4dGpzL2FwcC9hcGkvZGVhbHMvcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2RlYWxzL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvZGVhbHNcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2RlYWxzL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL2hvbWUvcnVubmVyL3dvcmtzcGFjZS9hcnRpZmFjdHMvZmxhcmUtbmV4dGpzL2FwcC9hcGkvZGVhbHMvcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdeals%2Froute&page=%2Fapi%2Fdeals%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdeals%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fartifacts%2Fflare-nextjs%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace%2Fartifacts%2Fflare-nextjs&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "pg":
/*!*********************!*\
  !*** external "pg" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = import("pg");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdeals%2Froute&page=%2Fapi%2Fdeals%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdeals%2Froute.ts&appDir=%2Fhome%2Frunner%2Fworkspace%2Fartifacts%2Fflare-nextjs%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Frunner%2Fworkspace%2Fartifacts%2Fflare-nextjs&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();
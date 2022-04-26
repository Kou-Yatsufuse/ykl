//------------------------------------------------------------------------------
//	ykl-1.3.0.js
//------------------------------------------------------------------------------
//	Copyright (c) 2015 - 2020 Kou Yatsufuse
//	Released under the MIT license
//	http://opensource.org/licenses/mit-license.php
//------------------------------------------------------------------------------

/**
* パッケージ宣言です。
* @namespace ykl
*/
var ykl = ykl || {};

//-----------------------------------------------------------------------------
//  ykl.commonFunctions Start.
//-----------------------------------------------------------------------------
/**
* 共通関数クラス宣言です。
* @public
* @static
* @namespace ykl.commonFunctions
*/
ykl.commonFunctions = {};

/**
* クライアント領域の幅を返します。
* @public
* @static
* @function
* @returns {Number} クライアント領域の幅です。
*/
ykl.commonFunctions.getClientWidth = function()
{
	return document.documentElement.clientWidth ||
		   document.body.clientWidth;
};
/**
* クライアント領域の高さを返します。
* @public
* @static
* @function
* @returns {Number} クライアント領域の高さです。
*/
ykl.commonFunctions.getClientHeight = function()
{
	return document.documentElement.clientHeight ||
		   document.body.clientHeight;

};
/**
* 横方向のスクロール量を取得します。
* @public
* @static
* @function
* @returns {Number} 横方向へのスクロール量です。
*/
ykl.commonFunctions.getScrollX = function()
{
	return window.pageXOffset                  ||
		   window.scrollX                      ||
		   document.documentElement.scrollLeft ||
		   document.body.scrollLeft;
};
/**
* 縦方向のスクロール量を取得します。
* @public
* @static
* @function
* @returns {Number} 縦方向へのスクロール量です。
*/
ykl.commonFunctions.getScrollY = function()
{
	return window.pageYOffset                 ||
		   window.scrollY                     ||
		   document.documentElement.scrollTop ||
		   document.body.scrollTop;
};
/**
* スクロール最大値情報を取得します。
* @public
* @static
* @function
* @returns {Object} スクロール最大値情報オブジェクトです。
*/
ykl.commonFunctions.getScrollMax = function()
{
	// 現在のスクロール量を保存します。
	var bakX = this.getScrollX();
	var bakY = this.getScrollY();

	// ありえない量のスクロールを行います。
	// ※スクロール量の最大値を取得するため。
	window.scrollBy(10000, 10000);

	// スクロールの最大値を取得します。
	var maxX = this.getScrollX();
	var maxY = this.getScrollY();

	// スクロール位置を復元します。
	window.scrollTo(bakX, bakY);

	// スクロールの最大値を返します。
	return { X : maxX, Y : maxY };
};
/**
* スクリーンサイズを取得します。
* @public
* @static
* @function
* @returns {Object} スクリーンサイズ情報オブジェクトです。
*/
ykl.commonFunctions.getScreenSize = function()
{
	// スクロール量を取得します。
	var scrollMax = this.getScrollMax();

	// スクリーンサイズを計算します。
	var screenW = this.getClientWidth()  + scrollMax.X;
	var screenH = this.getClientHeight() + scrollMax.Y;

	// スクリーンの幅と高さを返します。
	return { width : screenW, height : screenH };
};
/**
* HTML5のアニメーションフレームに対応しているかどうかを返します。
* @public
* @static
* @function
* @returns {Boolean} true：対応している。 false：対応していない。
*/
ykl.commonFunctions.canAnimationFrame = function()
{
	if(window.requestAnimationFrame) { return true; }
	return false;
};
/**
* 文字列の末尾にある「px」を取り除いて返します。
* @public
* @static
* @function
* @param {String} targetStr 処理対象となる文字列です。
* @returns {String} 整形した文字列です。
*/
ykl.commonFunctions.trimPxString = function(targetStr)
{
	// 'px'の文字インデックスを取得します。
	var index = targetStr.lastIndexOf('px');

	// 'px'の文字が末尾にない場合はそのまま返します。
	if(index < 0) { return targetStr; }

	// 文字列を切り取って返します。
	return targetStr.substr(0, targetStr.length - (index - 1));
};

/**
* bodyタグのonloadイベントに関数を追加します。
* @public
* @static
* @function
* @param {Function} func onload時に実行させる関数です。
*/
ykl.commonFunctions.addOnLoadFunction = function(func)
{
	// イベントに関数を登録します。
	window.addEventListener('load', func, false);
};

/**
 * 数値をフォーマットして返します。<br />
 * 必ず %?d という置換用文字列を含めて下さい。<br />
 * ない場合は指定された文字列がそのまま返ります。<br />
 * %5d のような指定であれば、５桁にゼロサプレスされた文字列が埋め込まれます。
 * @public
 * @static
 * @function
 * @param {String} format フォーマットの元になる文字列です。
 * @param {Number} number 埋め込まれる数値です。
 * @returns {String} 指定された桁にゼロサプレスされた文字列です。
 */
ykl.commonFunctions.formatNumber = function(format, number)
{
	// %の箇所を特定します。ない場合はフォーマット文をそのまま返します。
	var perIndex = format.indexOf('%');
	if(perIndex < 0) { return format; }
	
	// %の直近のdを特定します。ない場合はフォーマット文をそのまま返します。
	var decIndex = format.indexOf('d', perIndex + 1);
	if(decIndex < 0) { return format; }
	
	// 数値の箇所を切り出します。ない場合はフォーマット文をそのまま返します。
	var decStr = format.substr(perIndex + 1, decIndex - (perIndex + 1));
	if(decStr.length <= 0) { return format; }
	
	// 切り出した文字列を数値に変換します。
	var fix = parseInt(decStr, 10);
	
	// ループ準備
	var index    = 0;
	var indexMax = fix - number.toString().length;
	var newStr   = '';
	
	// ゼロで埋めた数値文字列を作成する。
	for(index = 0; index < indexMax; index++) { newStr += '0'; }
	newStr += number.toString();
	
	// 文字列を作成して返します。
	newStr = format.substr(0, perIndex) + newStr + format.substr(decIndex + 1);
	return newStr;
};

//-----------------------------------------------------------------------------
//  ykl.commonFunctions End.
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
//  ykl.animation Start.
//-----------------------------------------------------------------------------
/**
* アニメーションクラス宣言です。
* @public
* @static
* @namespace ykl.animation
*/
ykl.animation = {};

/**
* 開くときのアニメーションフラグです。
* @public
* @static
* @field
* @type Number
*/
ykl.animation.DRAW_OPEN = 0;

/**
* 閉じる時のアニメーションフラグです。
* @public
* @static
* @field
* @type Number
*/
ykl.animation.DRAW_CLOSE = 1;

/**
* 縦横アニメーションフラグです。
* @public
* @static
* @field
* @type Number
*/
ykl.animation.DIRECTION_WH = 0;

/**
* 横アニメーションフラグです。
* @public
* @static
* @field
* @type Number
*/
ykl.animation.DIRECTION_W = 1;

/**
* 縦アニメーションフラグです。
* @public
* @static
* @field
* @type Number
*/
ykl.animation.DIRECTION_H = 2;

/**
* 描画情報オブジェクトです。
* @private
* @static
* @field
* @type Object
*/
ykl.animation._drawInfo = {};

/**
* アニメーション中フラグです。
* @private
* @static
* @field
* @type Boolean
*/
ykl.animation._isAnimation = false;

/**
* 描画情報オブジェクトを返します。
* @public
* @static
* @function
* @returns {Object} 描画情報オブジェクトです。
*/
ykl.animation.getDrawInfo = function()
{
	return this._drawInfo;
};

/**
* 開閉アニメーションを行います。
* @public
* @static
* @function
* @param {Object} option 描画情報オブジェクトです。
*/
ykl.animation.toggle = function(option)
{
	// アニメーション中は終了するまで処理させない。
	if(this._isAnimation) { return; }
	this._isAnimation = true;

	// オプション値の補正。要素がない場合は終了する。
	option = this._fixOption(option);
	if(option.element === null) { return; }

	// 描画情報を設定する。
	this._drawInfo.element  = option.element;
	this._drawInfo.direction = option.direction;
	this._drawInfo.openClose = option.openClose;
	this._drawInfo.width     = option.width;
	this._drawInfo.height    = option.height;
	this._drawInfo.time      = option.time;

	// アニメーションを行う際は一番全面に表示する。
	this._drawInfo.element.style.zIndex = 100;

	// 描画時の刻み値を設定する。
	this._setDrawWH();

	// アニメーション開始時の幅、高さを設定する。
	this._setNowWH();

	// requestAnimationFrameが使用できるかで処理を分ける。
	if(ykl.commonFunctions.canAnimationFrame())
	{
		this._drawInfo.handle = requestAnimationFrame(ykl.animation._procAnimation);
	}
	else
	{
		//-----------------------------------------------------------------
		// requestAnimationFrameが使えない時はアニメーションしない。
		//-----------------------------------------------------------------
		if(this._drawInfo.openClose === this.DRAW_OPEN)
		{
			this._drawInfo.element.style.width  = this._drawInfo.width  + 'px';
			this._drawInfo.element.style.height = this._drawInfo.height + 'px';
		}
		else
		{
			this._drawInfo.element.style.display = 'none';
		}
		this._isAnimation = false;
	}
};

/**
* 描画情報オブジェクトを補正します。
* @private
* @static
* @function
* @param {Object} option 描画情報オブジェクトです。
* @returns {Object} 補正された描画情報オブジェクトです。
*/
ykl.animation._fixOption = function(option)
{
	// 要素の指定がない場合は終了。
	if(!option.element) { option.element = null; return; }

	// アニメーションの指定がない場合は縦横アニメーションにする。
	if(this._checkAnimationFlag(option.direction) === false)
	{
		option.direction = this.DIRECTION_WH;
	}
	// アニメーション速度が指定されていない場合はデフォルトを設定します。
	if(!option.time) { option.time = 5000; }

	// 開閉フラグが設定されていない場合は要素を見て決定する。
	if(!option.openClose)
	{
		if(option.element.style.display === 'none') { option.openClose = this.DRAW_OPEN;  }
		else                                        { option.openClose = this.DRAW_CLOSE; }
	}
	// 幅と高さが未設定の場合は要素から取得する。
	if(!option.width)  { option.width  = ykl.commonFunctions.trimPxString(option.element.style.width);  }
	if(!option.height) { option.height = ykl.commonFunctions.trimPxString(option.element.style.height); }

	// 補正した描画情報オブジェクトを返します。
	return option;
};

/**
* アニメーション方向フラグが正常かどうかを返します。
* @private
* @static
* @function
* @param {Number} flag アニメーション方向フラグです。
* @returns {Boolean} true：正常 false：異常
*/
ykl.animation._checkAnimationFlag = function(flag)
{
	// アニメーション方向が指定されている場合はtrueを返します。
	if(flag === this.DIRECTION_WH) { return true; }
	if(flag === this.DIRECTION_W)  { return true; }
	if(flag === this.DIRECTION_H)  { return true; }

	// アニメーションフラグが異常のためfalseを返します。
	return false;
};

/**
* 描画時の刻み値を設定します。
* @private
* @static
* @function
*/
ykl.animation._setDrawWH = function()
{
	// 刻み値を計算する。
	this._drawInfo.drawWidth  = this._drawInfo.width  / (this._drawInfo.time / 1000);
	this._drawInfo.drawHeight = this._drawInfo.height / (this._drawInfo.time / 1000);

	// 変更方向による補正。
	if(this._drawInfo.direction === this.DIRECTION_W) { this._drawInfo.drawHeight = 0; }
	if(this._drawInfo.direction === this.DIRECTION_H) { this._drawInfo.drawWidth  = 0; }

	// 閉じる場合はマイナス値にする。
	if(this._drawInfo.openClose === this.DRAW_CLOSE)
	{
		this._drawInfo.drawWidth  = -this._drawInfo.drawWidth;
		this._drawInfo.drawHeight = -this._drawInfo.drawHeight;
	}
};

/**
* アニメーション開始時の幅、高さを設定します。
* @private
* @static
* @function
*/
ykl.animation._setNowWH = function()
{
	// 開くアニメーションの時の処理。
	if(this._drawInfo.openClose === this.DRAW_OPEN)
	{
		// 縦横アニメーションする時。
		if(this._drawInfo.direction === this.DIRECTION_WH)
		{
			this._drawInfo.nowWidth  = 0;
			this._drawInfo.nowHeight = 0;
			return;
		}
		// 横アニメーションする時。
		if(this._drawInfo.direction === this.DIRECTION_W)
		{
			this._drawInfo.nowWidth  = 0;
			this._drawInfo.nowHeight = this._drawInfo.height;
			return;
		}
		// 縦アニメーションする時。
		this._drawInfo.nowWidth  = this._drawInfo.width;
		this._drawInfo.nowHeight = 0;
		return;
	}
	else
	{
		// 閉じるアニメーション時は最大値が初期値になる。
		this._drawInfo.nowWidth  = this._drawInfo.width;
		this._drawInfo.nowHeight = this._drawInfo.height;
		return;
	}
};

/**
* アニメーション処理を行います。
* @private
* @static
* @function
*/
ykl.animation._procAnimation = function()
{
	// 描画情報の取得。
	var drawInfo = ykl.animation.getDrawInfo();

	// 最新の幅、高さを計算する。
	drawInfo.nowWidth  += drawInfo.drawWidth;
	drawInfo.nowHeight += drawInfo.drawHeight;

	// 開くアニメーションか閉じるアニメーションかで処理を分ける。
	if(drawInfo.openClose === ykl.animation.DRAW_OPEN)
	{
		// 開くアニメーション時の処理。
		drawInfo.element.style.display = 'block';
		if(drawInfo.width <= drawInfo.nowWidth && drawInfo.height <= drawInfo.nowHeight)
		{
			// 現在の値が目標値を超えていれば目標値を設定して終了。
			drawInfo.element.style.width  = drawInfo.width  + 'px';
			drawInfo.element.style.height = drawInfo.height + 'px';

			// 呼び出しをキャンセル。
			cancelAnimationFrame(drawInfo.handle);

			// アニメーション終了。
			ykl.animation._isAnimation = false;
			return;
		}
	}
	else
	{
		// 閉じるアニメーション時の処理。
		if(drawInfo.nowWidth <= 0 || drawInfo.nowHeight <= 0)
		{
			// 幅または高さが0以下になったら要素を消して終了。
			drawInfo.element.style.width   = '0px';
			drawInfo.element.style.height  = '0px';
			drawInfo.element.style.display = 'none';

			// 呼び出しをキャンセル。
			cancelAnimationFrame(drawInfo.handle);

			// アニメーション終了。
			ykl.animation._isAnimation = false;

			// アニメーションが終了したら表示優先度を下げる。
			ykl.animation._drawInfo.element.style.zIndex = 0;
			return;
		}
	}
	// 現在の値を要素に反映する。
	drawInfo.element.style.width  = Math.floor(drawInfo.nowWidth)  + 'px';
	drawInfo.element.style.height = Math.floor(drawInfo.nowHeight) + 'px';

	// 呼び出しを止める。
	cancelAnimationFrame(drawInfo.handle);

	// 再度呼び出しを行う。
	drawInfo.handle = requestAnimationFrame(ykl.animation._procAnimation);
};
//-----------------------------------------------------------------------------
//  ykl.animation End.
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
//  ykl.scrollBarInfo Start.
//-----------------------------------------------------------------------------
/**
* スクロールバー情報クラス宣言です。
* このクラスではスクロールバーの情報を取得しますが、
* 画面が読み込み終わったタイミング（onload)でnewされないと値を取得することは出来ません。
* @public
* @namespace ykl.scrollBarInfo
* @constructor
*/
ykl.scrollBarInfo = function()
{
	// 初期化処理を行います。
	this._initialize();
};
/**
* スクロールバーの幅です。
* @private
* @field
* @type Number
*/
ykl.scrollBarInfo.prototype._scrollBarWidth = null;

/**
* スクロールバーの高さです。
* @private
* @field
* @type Number
*/
ykl.scrollBarInfo.prototype._scrollBarHeight = null;

/**
* スクロールバーの幅を返します。
* @public
* @function
* @returns {Number} スクロールバーの幅です。
*/
ykl.scrollBarInfo.prototype.getWidth = function() { return this._scrollBarWidth; };

/**
* スクロールバーの高さを返します。
* @public
* @function
* @returns {Number} スクロールバーの高さです。
*/
ykl.scrollBarInfo.prototype.getHeight = function() { return this._scrollBarHeight; };

/**
* スクロールバーを表示状態にします。
* @private
* @function
*/
ykl.scrollBarInfo.prototype._showScrollBar = function() { document.body.style.overflow = 'scroll'; };

/**
* スクロールバーを非表示状態にします。
* @private
* @function
*/
ykl.scrollBarInfo.prototype._hiddenScrollBar = function() { document.body.style.overflow = 'hidden'; };

/**
* スクロールバー表示を自動にします。
* @private
* @function
*/
ykl.scrollBarInfo.prototype._autoScrollBar = function() { document.body.style.overflow = 'auto'; };

/**
* 初期化処理を行います。
* @private
* @function
*/
ykl.scrollBarInfo.prototype._initialize = function()
{
	// スクロールバーを強制表示。
	this._showScrollBar();

	// クライアント領域の幅、高さを取得。
	var cw1 = ykl.commonFunctions.getClientWidth();
	var ch1 = ykl.commonFunctions.getClientHeight();

	// スクロールバーの強制非表示。
	this._hiddenScrollBar();

	// クライアント領域の幅、高さを取得。
	var cw2 = ykl.commonFunctions.getClientWidth();
	var ch2 = ykl.commonFunctions.getClientHeight();

	// スクロールバーのサイズを計算して格納する。
	this._scrollBarWidth  = cw2 - cw1;
	this._scrollBarHeight = ch2 - ch1;

	// スクロールバーの表示を自動に変更。
	this._autoScrollBar();
};
//-----------------------------------------------------------------------------
//  ykl.scrollBarInfo End.
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
//  ykl.imageComboBox Start.
//-----------------------------------------------------------------------------
/**
 * 画像コンボボックスクラスです。
 * @public
 * @param {String} id 自身のIDです。
 * @param {String} parentId 親要素のIDです。
 * @param {Number} imgWidth 画像の幅です。
 * @param {Number} imgHeight 画像の高さです。
 * @namespace ykl.imageComboBox
 * @constructor
 */
ykl.imageComboBox = function(id, parentId, imgWidth, imgHeight)
{
	// コンストラクタを実行。
	this._constructor(id, parentId, imgWidth, imgHeight);
};

/**
* 自身のIDです。
* @private
* @field
* @type String
*/
ykl.imageComboBox.prototype._id = null;

/**
* 親要素のIDです。
* @private
* @field
* @type String
*/
ykl.imageComboBox.prototype._parentId = null;

/**
* 画像の横幅です。
* @private
* @field
* @type Number
*/
ykl.imageComboBox.prototype._imgWidth = null;

/**
* 画像の高さです。
* @private
* @field
* @type Number
*/
ykl.imageComboBox.prototype._imgHeight = null;

/**
* パディングです。
* @private
* @field
* @type Number
*/
ykl.imageComboBox.prototype._padding = null;

/**
* 境界線の太さです。
* @private
* @field
* @type Number
*/
ykl.imageComboBox.prototype._borderWidth = null;

/**
* スクロールバーの幅です。
* @private
* @field
* @type Number
*/
ykl.imageComboBox.prototype._scrollBarWidth = null;

/**
* フレーム要素です。
* @private
* @field
* @type Object
*/
ykl.imageComboBox.prototype._frame = null;

/**
* ボックス要素です。
* @private
* @field
* @type Object
*/
ykl.imageComboBox.prototype._box = null;

/**
* リスト要素です。
* @private
* @field
* @type Object
*/
ykl.imageComboBox.prototype._list = null;

/**
* 項目情報配列です。
* @private
* @field
* @type Array
*/
ykl.imageComboBox.prototype._itemArray = null;

/**
* 現在選択中の項目インデックス番号です。
* @private
* @field
* @type Number
*/
ykl.imageComboBox.prototype._selectedIndex = null;

/**
* コンストラクタです。
* @private
* @function
* @param {String} id 自身のIDです。
* @param {String} parentId 親要素のIDです。
* @param {Number} imgWidth 画像の幅です。
* @param {Number} imgHeight 画像の高さです。
*/
ykl.imageComboBox.prototype._constructor = function(id, parentId, imgWidth, imgHeight)
{
	// パラメータを変数に格納します。
	this._id        = id;
	this._parentId  = parentId;
	this._imgWidth  = imgWidth;
	this._imgHeight = imgHeight;

	// その他項目の初期設定。
	this._padding       = 5;
	this._borderWidth   = 1;
	this._itemArray     = [];
	this._selectedIndex = -1;

	// スクロールバーの情報を取得します。
	var sbi = new ykl.scrollBarInfo();
	this._scrollBarWidth = sbi.getWidth();

	// フレーム、ボックス、リストを作成して格納します。
	this._frame = this._createFrame();
	this._box   = this._createBox();
	this._list  = this._createList();

	// フレームの子要素としてボックスとリストを追加する。
	this._frame.appendChild(this._box);
	this._frame.appendChild(this._list);

	// 親クラスにフレームを追加する。
	var parent = document.getElementById(this._parentId);
	parent.appendChild(this._frame);

	// 空の項目を先頭に追加しておく。
	this.add(null);

	// リストを非表示にしておく。
	this._list.style.display = 'none';
};

/**
* 画像を追加します。.
* @public
* @function
* @param {String} imgUrl 画像のURLです。
*/
ykl.imageComboBox.prototype.add = function(imgUrl)
{
	// 画像情報を作成して配列に追加。
	var imgInfo = {};
	imgInfo.url = imgUrl;
	this._itemArray.push(imgInfo);

	// 画像アイテムを作成して取得する。
	var item = this._createItem(imgInfo, this._itemArray.length - 1);

	// リストに画像アイテムを追加し、リストの高さを再計算する。
	this._list.appendChild(item);
	this._list.style.height = this._calcListHeight() + 'px';
};

/**
 * 指定範囲の数値範囲の画像を追加します。
 * @public
 * @function
 * @param {String} imgUrlFormat 画像URLのフォーマット文字列です。
 * @param {Number} start 開始数値です。
 * @param {Number} end 終了数値です。
 */
ykl.imageComboBox.prototype.addRange = function(imgUrlFormat, start, end)
{
	// ループ準備
	var index    = 0;
	var indexMax = end - start;
	var imgUrl   = '';
	
	// ループして指定範囲のURLを全て追加する。
	for(index = 0; index <= indexMax; index++)
	{
		imgUrl = ykl.commonFunctions.formatNumber(imgUrlFormat, start + index);
		this.add(imgUrl);
	}
};

/**
* 選択中の画像情報を取得します。.
* @public
* @function
* @returns {imgInfo} 選択画像情報です。
*/
ykl.imageComboBox.prototype.getSelectedInfo = function()
{
	return this._itemArray[this._selectedIndex];
};

/**
* フレーム要素を作成します。
* @private
* @function
* @returns {Element} フレーム要素です。
*/
ykl.imageComboBox.prototype._createFrame = function()
{
	// 要素を作成します。
	var frame = document.createElement('div');
	frame.id             = this._id;
	frame.style.margin   = '0';
	frame.style.padding  = '0';
	frame.style.position = 'relative';
	frame.style.width    = this._calcFrameWidth() + 'px';

	// フレームからマウスが離れた時のイベント定義。
	var that = this;
	frame.onmouseout = function(e) { that._procFrameOut(e); };

	// 作成したフレーム要素を返します。
	return frame;
};

/**
* ボックス要素を作成します。
* @private
* @function
* @returns {Element} ボックス要素です。
*/
ykl.imageComboBox.prototype._createBox = function()
{
	// 要素を作成します。
	var box = document.createElement('div');
	box.id            = this._id + '_Box';
	box.style.margin  = '0';
	box.style.padding = this._padding + 'px';
	box.style.width   = this._imgWidth + 'px';
	box.style.height  = this._imgHeight + 'px';

	// 境界線情報を設定します。
	this._setBorderParam(box);

	// クリックされた時の候補開閉処理イベントを定義します。
	var that = this;
	box.onclick = function() { that._toggleList(); };

	// 作成したボックス要素を返します。
	return box;
};

/**
* リスト要素を作成します。
* @private
* @function
* @returns {Element} リスト要素です。
*/
ykl.imageComboBox.prototype._createList = function()
{
	// 要素を作成します。
	var list = document.createElement('div');
	list.id             = this._id + '_List';
	list.style.margin   = '0';
	list.style.padding  = '0';
	list.style.position = 'absolute';
	list.style.top      = this._calcBoxHeight() + 'px';
	list.style.width    = this._calcListWidth() + 'px';
	list.style.overflow = 'scroll';

	// 境界線情報を設定します。
	this._setBorderParam(list);

	// 作成したリスト要素を返します。
	return list;
};

/**
* 項目を作成して返します。.
* @private
* @function
* @param {Object} imgInfo 画像情報オブジェクトです。
* @param {Number} index 項目インデックス番号です。
* @returns {Element} 項目要素です。
*/
ykl.imageComboBox.prototype._createItem = function(imgInfo, index)
{
	// 項目の作成。
	var item = document.createElement('div');
	item.id                    = this._id + '_Item' + index;
	item.style.margin          = '0';
	item.style.padding         = this._padding + 'px';
	item.style.position        = 'absolute';
	item.style.top             = (this._calcItemHeight() * index) + 'px';
	item.style.width           = this._imgWidth + 'px';
	item.style.height          = this._imgHeight + 'px';
	item.style.backgroundColor = 'white';
	this._setBorderParam(item);

	// クリック、マウスオーバー、マウスアウトのイベント定義。
	var that = this;
	item.onclick     = function() { that._selectItem(index); };
	item.onmouseover = function() { item.style.backgroundColor = '#00008B'; };
	item.onmouseout  = function() { item.style.backgroundColor = '#FFFFFF'; };

	// 画像情報オブジェクトに画像URLが設定されている時のみ処理。
	if(imgInfo.url)
	{
		// 画像要素の作成。
		var image = document.createElement('img');
		image.id     = this._id + '_Img' + index;
		image.src    = imgInfo.url;
		image.width  = this._imgWidth;
		image.height = this._imgHeight;

		// 項目に画像を追加する。
		item.appendChild(image);
	}
	// 作成した項目要素を返す。
	return item;
};

/**
* 項目を選択します。.
* @private
* @function
* @param {Number} index 選択された項目のインデックス番号です。
*/
ykl.imageComboBox.prototype._selectItem = function(index)
{
	// ボックス内の画像要素の削除。
	this._deleteBoxImage();

	// 選択された項目の項目情報を取得。
	var imgInfo = this._itemArray[index];

	// 画像URLがある場合のみ処理する。
	if(imgInfo.url)
	{
		// 画像要素を作成する。
		var image = document.createElement('img');
		image.id     = this._getBoxImageId();
		image.src    = imgInfo.url;
		image.width  = this._imgWidth;
		image.height = this._imgHeight;

		// 画像要素をボックスに追加する。
		this._box.appendChild(image);
	}
	// リストを閉じる。
	this._closeList();

	// 選択中インデックス番号を保存。
	this._selectedIndex = index;
};

/**
* 要素に境界線情報を設定します。
* @private
* @function
* @param {Element} element 境界線を設定する要素です。
*/
ykl.imageComboBox.prototype._setBorderParam = function(element)
{
	// 境界線情報を設定する。
	element.style.borderStyle = 'solid';
	element.style.borderColor = '#000000';
	element.style.borderWidth = this._borderWidth + 'px';
};

/**
* トグルアニメーションを行います。
* @private
* @function
*/
ykl.imageComboBox.prototype._toggleList = function()
{
	// トグルアニメーションを行います。
	ykl.animation.toggle(
	{
		element   : this._list,
		direction : ykl.animation.DIRECTION_H,
		width     : this._calcListWidth(),
		height    : this._calcLimitHeight(),
		time      : 8000
	});
};

/**
* リストを閉じます。
* @private
* @function
*/
ykl.imageComboBox.prototype._closeList = function()
{
	// アニメーションを使用して閉じる。
	ykl.animation.toggle(
	{
		openClose : ykl.animation.DRAW_CLOSE,
		element   : this._list,
		direction : ykl.animation.DIRECTION_H,
		width     : this._calcListWidth(),
		height    : this._calcLimitHeight(),
		time      : 8000
	});
};

/**
* フレームからマウスが離れた時の処理です。
* @private
* @function
* @param {Event} e イベントオブジェクトです。
*/
ykl.imageComboBox.prototype._procFrameOut = function(e)
{
	// クラスのIDの長さを取得。
	var idLen = this._id.length;

	// マウスが移動した要素のIDを取得。
	var targetId = e.relatedTarget.id.substr(0, idLen);

	// フレームの子要素なら処理を抜ける。
	if(this._id === targetId) { return; }

	// リストを非表示にする。
	this._closeList();
};

/**
* ボックス要素内の画像要素IDを取得します。.
* @private
* @function
* @returns {String} ボックス要素に含まれる画像要素のIDです。
*/
ykl.imageComboBox.prototype._getBoxImageId = function() { return this._id + '_BoxImage'; };

/**
* ボックス内の画像要素を削除します。.
* @private
* @function
*/
ykl.imageComboBox.prototype._deleteBoxImage = function()
{
	var ele = document.getElementById(this._getBoxImageId());
	if(ele) { this._box.removeChild(ele); }
};

/**
* フレームの幅を計算して返します。.
* @private
* @function
* @returns {Number} フレームの幅です。
*/
ykl.imageComboBox.prototype._calcFrameWidth = function()
{
	return this._imgWidth + (this._padding * 2) + (this._borderWidth * 2) + this._scrollBarWidth;
};

/**
* ボックスの高さを計算して返します。.
* @private
* @function
* @returns {Number} ボックスの高さです。
*/
ykl.imageComboBox.prototype._calcBoxHeight = function()
{
	return this._imgHeight + (this._padding * 2) + (this._borderWidth * 2);
};

/**
* リストの幅を計算して返します。.
* @private
* @function
* @returns {Number} リストの幅です。
*/
ykl.imageComboBox.prototype._calcListWidth = function()
{
	return this._imgWidth + (this._padding * 2) + (this._borderWidth * 2) + this._scrollBarWidth;
};

/**
* リストの高さを計算して返します。.
* @private
* @function
* @returns {Number} リストの高さです。
*/
ykl.imageComboBox.prototype._calcListHeight = function()
{
	var height = this._imgHeight + (this._padding * 2) + (this._borderWidth * 2);
	return height * this._itemArray.length;
};

/**
* 項目の高さを計算して返します。.
* @private
* @function
* @returns {Number} 項目の高さです。
*/
ykl.imageComboBox.prototype._calcItemHeight = function()
{
	return this._imgHeight + (this._padding * 2) + (this._borderWidth * 2);
};

/**
* 画面に入りきる高さを計算して返します。.
* @private
* @function
* @returns {Number} 画面に入りきる高さです。
*/
ykl.imageComboBox.prototype._calcLimitHeight = function()
{
	// 画面高さとリストの高さ、小さい方をリストの高さとする。
	var limitHeight = ykl.commonFunctions.getClientHeight() - (this._frame.offsetTop + this._calcBoxHeight() + this._scrollBarWidth);
	var listHeight = this._calcListHeight() + this._scrollBarWidth;

	if(limitHeight > listHeight) { return listHeight; }
	return limitHeight;
};
//-----------------------------------------------------------------------------
//  ykl.imageComboBox End.
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
//  ykl.slideImageMenu Start.
//-----------------------------------------------------------------------------
/**
 * 画像スライドメニュークラスです。
 * @public
 * @param {String} id 自身のIDです。
 * @param {String} parentId 親要素のIDです。
 * @param {Boolean} menuIsTate true：縦メニュー false：横
 * @param {Number} menuWorH メニューの横幅または高さです。
 * @param {Number} itemWidth 項目の幅です。
 * @param {Number} itemHeight 項目の高さです。
 * @param {Function} callback 項目選択時のコールバック関数です。
 * @namespace ykl.slideImageMenu
 * @constructor
 */
ykl.slideImageMenu = function(id, parentId, menuIsTate, menuWorH, itemWidth, itemHeight, callback)
{
	// コンストラクタを呼び出します。
	this._constructor(id, parentId, menuIsTate, menuWorH, itemWidth, itemHeight, callback);
};

/**
 * 自身のIDです。
 * @private
 * @field
 * @type String
 */
ykl.slideImageMenu.prototype._id = null;

/**
 * 親要素のIDです。
 * @private
 * @field
 * @type String
 */
ykl.slideImageMenu.prototype._parentId = null;

/**
 * メニューが縦かどうかを表します。
 * @private
 * @field
 * @type Boolean
 */
ykl.slideImageMenu.prototype._menuIsTate = null;

/**
 * メニュークラスの幅または高さです。
 * @private
 * @field
 * @type Number
 */
ykl.slideImageMenu.prototype._menuWorH = null;

/**
 * 項目の幅です。
 * @private
 * @field
 * @type Number
 */
ykl.slideImageMenu.prototype._itemWidth = null;

/**
 * 項目の高さです。
 * @private
 * @field
 * @type Number
 */
ykl.slideImageMenu.prototype._itemHeight = null;

/**
 * 項目選択時のコールバック関数です。
 * @private
 * @field
 * @type Function
 */
ykl.slideImageMenu.prototype._callback = null;

/**
 * 項目情報配列です。
 * @private
 * @field
 * @type Array
 */
ykl.slideImageMenu.prototype._itemInfoArray = null;

/**
 * パディングです。
 * @private
 * @field
 * @type Number
 */
ykl.slideImageMenu.prototype._padding = null;

/**
 * 境界線の幅です。
 * @private
 * @field
 * @type Number
 */
ykl.slideImageMenu.prototype._borderWidth = null;

/**
 * スクロールバーのサイズです。
 * @private
 * @field
 * @type Number
 */
ykl.slideImageMenu.prototype._scrollBarSize = null;

/**
 * フレーム要素です。
 * @private
 * @field
 * @type Element
 */
ykl.slideImageMenu.prototype._frame = null;

/**
 * コンストラクタです。
 * @private
 * @function
 * @param {String} id 自身のIDです。
 * @param {String} parentId 親要素のIDです。
 * @param {Number} menuWorH メニュークラスの幅または高さです。
 * @param {Number} itemWidth 項目の幅です。
 * @param {Number} itemHeight 項目の高さです。
 * @param {Function} callback 項目選択時のコールバック関数です。
 */
ykl.slideImageMenu.prototype._constructor = function(id, parentId, menuIsTate, menuWorH, itemWidth, itemHeight, callback)
{
	// 引数をメンバに格納します。
	this._id         = id;
	this._parentId   = parentId;
	this._menuIsTate = menuIsTate;
	this._menuWorH   = menuWorH;
	this._itemWidth  = itemWidth;
	this._itemHeight = itemHeight;
	this._callback   = callback;
	
	// メンバ変数を初期化します。
	this._itemInfoArray = [];
	this._padding       = 5;
	this._borderWidth   = 1;
	
	// スクロールバーのサイズを取得します。
	var sbi = new ykl.scrollBarInfo();
	this._scrollBarSize = sbi.getWidth();
	
	// フレームを作成し、親要素の子として追加する。
	this._frame = this._createFrame();
	var parentElement = document.getElementById(this._parentId);
	parentElement.appendChild(this._frame);
};

/**
 * 項目を追加します。
 * @public
 * @function
 * @param {String} imgUrl 画像のURLです。
 * @param {Object} freeObj ユーザ任意情報です。
 */
ykl.slideImageMenu.prototype.add = function(imgUrl, freeObj)
{
	// 項目情報オブジェクトを作成して配列に追加します。
	var itemInfo = {imageUrl : imgUrl, freeObject : freeObj};
	this._itemInfoArray.push(itemInfo);
	
	// 項目を作成してフレームに追加します。
	var item = this._createItem(this._itemInfoArray.length - 1, itemInfo);
	this._frame.appendChild(item);
};

/**
 * フレーム要素を作成します。
 * @private
 * @function
 * @return {Element} フレーム要素です。
 */
ykl.slideImageMenu.prototype._createFrame = function()
{
	var frame = document.createElement('div');
	frame.id             = this._id;
	frame.style.margin   = '0';
	frame.style.padding  = '0';
	frame.style.position = 'relative';
	frame.style.overflow = 'scroll';

	// メニューの縦横でサイズの計算を切り替えます。
	if(this._menuIsTate)
	{
		frame.style.width    = this._calcFrameWidth() + 'px';
		frame.style.height   = this._menuWorH + 'px';
	}
	else
	{
		frame.style.width    = this._menuWorH + 'px';
		frame.style.height   = this._calcFrameHeight() + 'px';
	}
	// 作成したフレームを返す。
	return frame;
};

/**
 * フレームの幅を計算して返します。.
 * @private
 * @function
 * @return {Number} フレームの幅です。
 */
ykl.slideImageMenu.prototype._calcFrameWidth = function()
{
	return this._itemWidth +  (this._padding * 2) + (this._borderWidth * 2) + this._scrollBarSize;
};

/**
 * フレームの高さを計算して返します。.
 * @private
 * @function
 * @return {Number} フレームの高さです。
 */
ykl.slideImageMenu.prototype._calcFrameHeight = function()
{
	return this._itemHeight + (this._padding * 2) + (this._borderWidth * 2) + this._scrollBarSize;
};

/**
 * 項目を作成します。
 * @private
 * @function
 * @param {Number} index 項目のインデックス番号です。
 * @param {Object} itemInfo 項目情報です。
 * @return {Element} 項目要素です。
 */
ykl.slideImageMenu.prototype._createItem = function(index, itemInfo)
{
	// アイテムを作成します。
	var item = document.createElement('div');
	item.id                = this._id + '_Item' + index;
	item.style.margin      = '0';
	item.style.padding     = this._padding + 'px';
	item.style.position    = 'absolute';
	item.style.width       = this._itemWidth + 'px';
	item.style.height      = this._itemHeight + 'px';
	item.style.borderStyle = 'solid';
	item.style.borderWidth = this._borderWidth + 'px';
	item.style.borderColor = '#000000';

	// メニューの縦横で表示位置を切り替えます。
	if(this._menuIsTate)
	{
		item.style.left = '0px';
		item.style.top  = (this._calcItemHeight() *index) + 'px';
	}
	else
	{
		item.style.left = (this._calcItemWidth() * index) + 'px';
		item.style.top  = '0px';
	}

	// イベントを設定します。
	var that = this;
	item.onclick = function()
	{
		// コールバックが設定されていない場合は何もしない。
		if(!that._callback) { return; }
		
		// インデックス番号とユーザ任意情報をコールバックする。
		var freeObject = that._itemInfoArray[index].freeObject;
		that._callback(index, freeObject); 
	};
	item.onmouseover = function() { item.style.backgroundColor = '#00008B'; };
	item.onmouseout  = function() { item.style.backgroundColor = '#FFFFFF'; };

	// 画像要素を作成します。
	var image = document.createElement('img');
	image.id            = this._id + '_Img' + index;
	image.style.margin  = '0';
	image.style.padding = '0';
	image.src           = itemInfo.imageUrl;
	image.width         = this._itemWidth;
	image.height        = this._itemHeight;

	// アイテムの子クラスとして画像要素を追加します。
	item.appendChild(image);

	// 作成したアイテムを返します。
	return item;
};

/**
 * 指定されたインデックスのオブジェクトを返します。
 * @public
 * @function
 * @return {Object} アイテム情報です。
 */
ykl.slideImageMenu.prototype.getNowIndexObject = function(index)
{
	return this._itemInfoArray[index].freeObject;
};

/**
 * アイテムの幅を計算して返します。
 * @private
 * @function
 * @return {Number} アイテムの幅です。
 */
ykl.slideImageMenu.prototype._calcItemWidth = function()
{
	return this._itemWidth + (this._padding * 2) + (this._borderWidth * 2);
};

/**
 * アイテムの高さを計算して返します。.
 * @private
 * @function
 * @return {Number} アイテムの高さです。
 */
ykl.slideImageMenu.prototype._calcItemHeight = function()
{
	return this._itemHeight + (this._padding * 2) + (this._borderWidth * 2);
};
//-----------------------------------------------------------------------------
//  ykl.slideImageMenu End.
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
//  ykl.showImage Start.
//-----------------------------------------------------------------------------
/**
 * 画像表示クラス宣言です。
 * @public
 * @static
 * @namespace ykl.showImage
 */
ykl.showImage = {};

/**
 * 画像要素です。
 * @private
 * @field
 * @type Element
 */
ykl.showImage._imgElement = null;

/**
 * 背景要素です。
 * @private
 * @field
 * @type Element
 */
ykl.showImage._backElement = null;

/**
 * 画像を画面中央に表示します。
 * @public
 * @function
 * @param {String} url 画像のURLです。
 * @param {Number} width 画像の幅です。
 * @param {Number} height 画像の高さです。
 */
ykl.showImage.execute = function(url, width, height)
{
	// スクリーン領域を取得します。
	var screenSize = ykl.commonFunctions.getScreenSize();
        
	// クライアント領域を取得します。
	var clientW = ykl.commonFunctions.getClientWidth();
	var clientH = ykl.commonFunctions.getClientHeight();
        
	// 画像要素と背景要素を取得します。
	this._imgElement  = this._createImageElement(url, width, height);
	this._backElement = this._createBackElement(screenSize.width, screenSize.height);

	// 値を補正します。
	if(clientW < width)	 { clientW  = width;  }
	if(clientH < height) { clientH  = height; }

	// 画像の表示位置を計算します。
	var imgX = ( clientW / 2 ) - ( width  / 2 ) + ykl.commonFunctions.getScrollX();
	var imgY = ( clientH / 2 ) - ( height / 2 ) + ykl.commonFunctions.getScrollY();

	// 画像を配置します。
	this._imgElement.style.position = 'absolute';
	this._imgElement.style.left     = imgX + 'px';
	this._imgElement.style.top      = imgY + 'px';

	// bodyの子要素として追加します。
	document.body.appendChild(this._backElement);
	document.body.appendChild(this._imgElement);
};

/**
 * 画像要素を作成します。
 * @private
 * @function
 * @param {String} url 画像のURLです。
 * @param {Number} width 画像の幅です。
 * @param {Number} height 画像の高さです。
 * @return {Element} 画像要素です。
 */
ykl.showImage._createImageElement = function(url, width, height)
{
	// 画像要素を作成します。
	var image = document.createElement('img');
	image.id           = 'showImage';
	image.src          = url;
	image.width        = width;
	image.height       = height;
	image.style.zIndex = 15;

	// イベントを設定します。
	var that = this;
	image.onclick     = function() { that._removeElements(); };
	image.onmouseover = function() { image.style.cursor = 'pointer'; };
	image.onmouseout  = function() { image.style.cursor = 'default'; };

	// 画像要素を返します。
	return image;
};

/**
 * 背景要素を作成します。
 * @private
 * @function
 * @param {Number} width
 * @param {Number} height
 * @return {Element} 背景要素です。
 */
ykl.showImage._createBackElement = function(width, height)
{
	// 背景要素を作成します。
	var back = document.createElement('div');
	back.id                    = 'backgroundScreen';
	back.style.margin          = '0';
	back.style.padding         = '0';
	back.style.position        = 'absolute';
	back.style.left            = '0px';
	back.style.top             = '0px';
	back.style.width           = width + 'px';
	back.style.height          = height + 'px';
	back.style.backgroundColor = '#000000';
	back.style.zIndex          = 10;
	back.style.opacity         = 0.75;

	// 背景要素を返します。
	return back;
};

/**
 * 画像、背景要素を削除します。
 * @private
 * @function
 */
ykl.showImage._removeElements = function()
{
	// body要素から要素を削除します。
	document.body.removeChild(this._imgElement);
	document.body.removeChild(this._backElement);
	
	// 要素にnullを設定して参照をなくします。
	this._imgElement = null;
	this._backElement = null;
};
//-----------------------------------------------------------------------------
//  ykl.showImage End.
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
//  ykl.appearImage Start.
//-----------------------------------------------------------------------------
/**
 * 画像連続表示クラスです。
 * @param {String} id 自身のIDです。
 * @param {String} parentId 親要素のIDです。
 * @param {Number} refreshRate 表示更新間隔です（ミリ秒）。
 * @namespace ykl.appearImage
 * @constructor
 */
ykl.appearImage = function(id, parentId, refreshRate)
{
	// コンストラクタを呼び出します。
	this._constructor(id, parentId, refreshRate);
};

/**
 * 自身のIDです。
 * @private
 * @field
 * @type String
 */
ykl.appearImage.prototype._id = null;

/**
 * 親要素のIDです。
 * @private
 * @field
 * @type String
 */
ykl.appearImage.prototype._parentId = null;

/**
 * 表示更新間隔です（ミリ秒）。
 * @private
 * @field
 * @type Number
 */
ykl.appearImage.prototype._refreshRate = null;

/**
 * 画像情報配列です。
 * @private
 * @field
 * @type Array
 */
ykl.appearImage.prototype._imageInfoArray = null;

/**
 * 現在表示している画像のインデックス番号です。
 * @private
 * @field
 * @type Number
 */
ykl.appearImage.prototype._nowImageIndex = null;

/**
 * 画像要素です。
 * @private
 * @field
 * @type Element
 */
ykl.appearImage.prototype._imageElement = null;

/**
 * タイマIDです。
 * @private
 * @field
 * @type Number
 */
ykl.appearImage.prototype._timerId = null;

/**
 * 現在の透明度です。
 * @private
 * @field
 * @type Number
 */
ykl.appearImage.prototype._nowOpacity = null;

/**
 * 画像変更フラグです。
 * @private
 * @field
 * @type Boolean
 */
ykl.appearImage.prototype._imageChangeFlag = null;

/**
 * 画像透明度の刻み値です。
 * @private
 * @field
 * @type Number
 */
ykl.appearImage.prototype._opacityStep = null;

/**
 * コンストラクタです。
 * @private
 * @function
 * @param {String} id 自身のIDです。
 * @param {String} parentId 親要素のIDです。
 * @param {Number} refreshRate 表示更新間隔です（ミリ秒）。
 */
ykl.appearImage.prototype._constructor = function(id, parentId, refreshRate)
{
	// 引数をメンバ変数に格納します。
	this._id          = id;
	this._parentId    = parentId;
	this._refreshRate = refreshRate;
	
	// メンバ変数を初期化します。
	this._imageInfoArray  = [];
	this._nowImageIndex   = -1;
	this._timerId         = null;
	this._nowOpacity      = 0;
	this._imageChangeFlag = false;
	this._opacityStep     = 0;
	
	// 画像要素を作成しておきます。
	this._imageElement = this._createImageElement();
	
	// 親要素に画像要素を追加します。
	var parentElement = document.getElementById(this._parentId);
	parentElement.appendChild(this._imageElement);
};

/**
 * 表示する画像を追加します。
 * @public
 * @function
 * @param {String} url 画像のURLです。
 * @param {Number} width 画像の幅です。
 * @param {Number} height 画像の高さです。
 * @param {Number} appearTime 表示されるまでにかかる時間です（ミリ秒）。
 * @param {Number} stayTime 表示されてから次の画像に変わるまでの時間です（ミリ秒）。
 */
ykl.appearImage.prototype.add = function(url, width, height, appearTime, stayTime)
{
	// 画像情報を格納します。
	var imageInfo =
	{
		url        : url,
		width      : width,
		height     : height,
		appearTime : appearTime,
		stayTime   : stayTime
	};
	// 作成した画像情報を配列に保存します。
	this._imageInfoArray.push(imageInfo);
};

/**
 * 表示する画像の数を取得します。
 * @public
 * @function
 * @return {Number} 表示する画像の数です。
 */
ykl.appearImage.prototype.getImageCount = function()
{
	// 画像情報配列の数を返します。
	return this._imageInfoArray.length;
};

/**
 * 画像表示を開始します。
 * @private
 * @function
 */
ykl.appearImage.prototype.start = function()
{
	// 次の画像を表示します。
	// ※この場合はインデックスの初期値が-1なので、最初の画像からになります。
	this._startNext();
};

/**
 * 現在の画像情報を取得します。
 * @public
 * @function
 * @returns {Object} 現在の画像情報です。
 */
ykl.appearImage.prototype.getNowImageInfo = function()
{
	return this._imageInfoArray[this._nowImageIndex];
};

/**
 * 画像要素を作成します。
 * @private
 * @function
 * @return {Element} 画像要素です。
 */
ykl.appearImage.prototype._createImageElement = function()
{
	// 画像要素の作成します。
	var ele = document.createElement('img');
	ele.id            = this._id;
	ele.alt           = 'AppearImage';
	ele.style.margin  = '0';
	ele.style.padding = '0';

	// 作成した画像要素を返します。
	return ele;
};

/**
 * 画像表示を行います。
 * @private
 * @function
 * @return {Function} 画像表示処理関数です。
 */
ykl.appearImage.prototype._dispImage = function()
{
	var that = this;        
	return function()
	{
		// 画像情報がない場合は処理終了します。
		if(that.getImageCount() <= 0) { return; }

		// タイマーを止めます。
		that._stopTimer();

		// 画像変更フラグが立っているなら次の画像を表示開始します。
		if(that._imageChangeFlag) { that._startNext(); return; }

		// 透明度を設定します。
		that._nowOpacity += that._opacityStep;
		that._imageElement.style.opacity = that._nowOpacity / 100;

		// 現在の画像情報を取得します。
		var imageInfo = that.getNowImageInfo();

		// 不透明でなくなったら待機時間後に画像変更する。
		if(that._nowOpacity >= 100)
		{
			that._imageChangeFlag = true;
			that._timerId = setTimeout(that._dispImage(), imageInfo.stayTime);
			return;
		}
		// 次の描画処理を起動。
		that._timerId = setTimeout(that._dispImage(), that._refreshRate);
	};
};

/**
 * 次の画像表示を開始します。
 * @private
 * @function
 */
ykl.appearImage.prototype._startNext = function()
{
	// 画像変更フラグをリセットします。
	this._imageChangeFlag = false;

	// 画像の透明度を0に設定します。
	this._nowOpacity = 0;
	this._imageElement.style.opacity = this._nowOpacity;
            
	// 次の画像インデックスを取得します。
	var nextIndex = this._getNextImageIndex();
            
	// 画像情報を取得して、透明度の刻み値を計算します。
	var imageInfo = this._imageInfoArray[nextIndex];
	this._opacityStep = 100 / (imageInfo.appearTime / this._refreshRate);
	        
	// 画像情報を画像要素に設定。
	this._imageElement.src    = imageInfo.url;
	this._imageElement.width  = imageInfo.width;
	this._imageElement.height = imageInfo.height;
        
	// タイマーの起動
	this._timerId = setTimeout(this._dispImage(), 0);
};

/**
 * タイマーを停止します。
 * @private
 * @function
 */
ykl.appearImage.prototype._stopTimer = function()
{
	// タイマーIDが既にある場合はタイマー停止します。
	if(this._timerId)
	{
		clearTimeout(this._timerId);
		this._timerId = null;
	}
};

/**
 * 次の画像インデックス番号を取得します。
 * @private
 * @function
 * @returns {Number} 次の画像インデックス番号です。
 */
ykl.appearImage.prototype._getNextImageIndex = function()
{
	// 現在の画像インデックスがマイナス値の場合は0に補正して終了します。
	if(this._nowImageIndex < 0)
	{
		this._nowImageIndex = 0; 
		return this._nowImageIndex;
	}
	
	// インデックスが終端まで来ているかで処理を分けます。
	if((this.getImageCount() - 1) <= this._nowImageIndex)
	{
		//現在の画像インデックスが最後だった場合は0に戻します。
		this._nowImageIndex = 0;
	}
	else
	{
		// 次の画像があるのでインデックス番号を次に設定します。
		this._nowImageIndex++;
	}
	// インデックス番号を返します。
	return this._nowImageIndex;
};
//-----------------------------------------------------------------------------
//  ykl.appearImage End.
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
//  ykl.tileImages Start.
//-----------------------------------------------------------------------------
/**
 * 画像をタイル状に表示するクラスです。
 * @param {String} id 自身のIDです。
 * @param {String} parentId 親要素のIDです。
 * @param {Number} columnCnt カラム数です。
 * @param {Number} 画像のパディングです(px)。
 * @namespace ykl.tileImages
 * @constructor
 */
ykl.tileImages = function(id, parentId, columnCnt, padding)
{
	this._constructor(id, parentId, columnCnt, padding);
};
/**
 * 自要素のID
 * @private
 * @field
 * @type String
 */
ykl.tileImages.prototype._id = null;

/**
 * 親要素のID
 * @private
 * @field
 * @type String
 */
ykl.tileImages.prototype._parentId = null;

/**
 * 横カラム数
 * @private
 * @field
 * @type Number
 */
ykl.tileImages.prototype._columnCnt = null;

/**
 * パディング
 * @private
 * @field
 * @type Number
 */
ykl.tileImages.prototype._padding = null;

/**
 * 画像の横幅です。
 * @private
 * @field
 * @type Number
 */
ykl.tileImages.prototype._imgWidth = null;

/**
 * 表示用フレーム情報配列です。
 * @private
 * @field
 * @type Array
 */
ykl.tileImages.prototype._dispFrames = [];

/**
 * フレームの高さ情報配列です。
 * @private
 * @field
 * @type Array
 */
ykl.tileImages.prototype._frameHeight = [];
/**
 * コンストラクタ
 * @private
 * @function
 * @param {String} id 自要素のID
 * @param {String} parentId 
 * @param {Number} columnCnt
 * @param {Number} padding
 */
ykl.tileImages.prototype._constructor = function(id, parentId, columnCnt, padding)
{
	// 引数をメンバ変数に格納。
	this._id        = id;
	this._parentId  = parentId;
	this._columnCnt = columnCnt;
	this._padding   = padding;
	
	// カラム数が指定されていない場合はデフォルト(3)とする。
	if(!this._columnCnt) { this._columnCnt = 3; }

	// パディングが指定されていない場合はデフォルトとして(3)とする。
	if(!this._padding) { this._padding = 3; }

	// デフォルトでスクロールバーを表示する。
	document.body.style.overflow = "scroll";

	// 親要素の取得、ない場合はエラーメッセージを表示して終了。
	var parentElement = document.getElementById(this._parentId);
	if(!parentElement) { alert("ParentID Nothing!"); return; }
	
	// 表示領域からパディング、枠線分取り除いたものが画像横幅となる。
	var areaWidth = this._getClientWidth(this._parentId);
	this._imgWidth = this._getImgWidth(areaWidth);

	// カラム数分フレームを作成する。
	var index;
	for(index = 0; index < this._columnCnt; index++)
	{
		// 要素の作成とプロパティの設定。
		var	frame = document.createElement("div");
		frame.style.float = "left";
		frame.style.width = this._imgWidth + "px";
		frame.style.padding = this._padding + "px";
		
		// 表示フレーム配列に追加し、親要素に子要素として追加。
		this._dispFrames.push(frame);
		parentElement.appendChild(frame);

		// フレーム毎の高さ計算配列を作成。
		this._frameHeight.push(0);
	}
	var br = document.createElement("br");
	br.style.clear = "both";
	parentElement.appendChild(br);

	// ウィンドウがリサイズされたときの処理
	window.addEventListener('resize', { myObj: this, handleEvent: this._recalcImgWidth} );
};
/**
 * 画像を追加します。
 * @public
 * @function
 * @param {String} imgPath
 * @param {Number} width
 * @param {Number} height
 */
ykl.tileImages.prototype.add = function(imgPath, width, height)
{
	// 画像情報オブジェクトを作成。
	var imgData =
	{
		path  : imgPath,
		w     : width,
		h     : height
	};
	// 一番高さが小さいカラムのインデックスを取得。
	var index = this._getLowHeightFrame();
	
	// 画像要素の作成。
	var imgElement = this._createImageElement(imgData);

	// 一番小さいカラムに画像要素を追加。
	this._dispFrames[index].appendChild(imgElement);

	// 追加した画像要素分高さを増やしておく。
	this._frameHeight[index] += this._getImgHeight(width, height);
};
/**
 * 画像要素を作成して返します。
 * @private
 * @function
 * @param {Object} imgData
 * @return {Object} 
 */
ykl.tileImages.prototype._createImageElement = function(imgData)
{
	// 画像要素を作成して、画像のパスとクリック時に拡大表示されるよう設定。
	var imgElement = document.createElement("img");
	imgElement.src = imgData.path;
	imgElement.width = imgData.w;
	imgElement.height = imgData.h;
	imgElement.loading = "lazy";
	imgElement.onclick = function(){ ykl.showImage.execute(imgData.path, imgData.w, imgData.h); }

	// 作成した要素を返す。
	return imgElement;
};
/**
 * 全カラムの中から一番縦の長さが小さいカラムインデックスを返します。
 * @private
 * @function
 * @return {Number} カラムインデックス
 */
ykl.tileImages.prototype._getLowHeightFrame = function()
{
	// 変数準備
	var index;
	var indexMax  = this._frameHeight.length;
	var minIndex  = 0;
	var minHeight = this._frameHeight[0];

	// 全カラムをチェック対象とする。
	for(index = 0; index < indexMax ; index++)
	{
		// 最小の長さより小さい場合に処理。
		if(minHeight > this._frameHeight[index])
		{
			// 最小の長さと、そのカラムインデックスを保存。
			minHeight = this._frameHeight[index];
			minIndex = index;
		}
	}
	// 最小のカラムインデックスを返す。
	return minIndex;
};
/**
 * 横幅の大きさから高さを計算して返します。
 * @private
 * @function
 * @param {Number} width 画像幅
 * @param {Number} height 画像高さ
 * @return {Number} 横幅と同縮小率の高さ。
 */
ykl.tileImages.prototype._getImgHeight = function(width, height)
{
	// 横幅が縮小される同じ比率で高さを返す。
	var per = this._imgWidth / width;
	return height * per;
};
/**
 * 指定要素のクライアント領域幅を取得します。
 * @private
 * @function
 * @param {String} elementId 取得対象の要素ID
 * @return {Number} クライアント領域幅
 */
ykl.tileImages.prototype._getClientWidth = function(elementId)
{
	// 親領域の取得。ない場合はnullを返す。
	var parentElement = document.getElementById(elementId);
	if(!parentElement) { return null; }

	// パディングと枠線分の幅を計算。
	var paddingWidth = parentElement.style.paddingLeft +
					   parentElement.style.paddingRight + 2;

	// クライアント領域の横幅を返す。
	return parentElement.clientWidth - paddingWidth;
}
/**
 * 画像表示横幅を取得します。
 * @private
 * @function
 * @param {Number} areaWidth 表示領域の幅
 * @return {Number} 画像表示横幅
 */
ykl.tileImages.prototype._getImgWidth = function(areaWidth)
{
	return Math.floor((areaWidth / this._columnCnt)) - (this._padding * 2);
}
/**
 * ウィンドウリサイズ時の画像幅再計算処理
 * @private
 * @function
 */
ykl.tileImages.prototype._recalcImgWidth = function()
{
	// 渡したthisオブジェクトをthatにする。
	var that = this.myObj;

	// 画像サイズの計算
	var cWidth = that._getClientWidth(that._parentId);
	that._imgWidth = that._getImgWidth(cWidth);

	// 全フレームの画像横幅を更新する。
	var index;
	for(index = 0; index < that._columnCnt; index++)
	{
		that._dispFrames[index].style.width = that._imgWidth + "px";
	}
}
//-----------------------------------------------------------------------------
//  ykl.tileImages End.
//-----------------------------------------------------------------------------

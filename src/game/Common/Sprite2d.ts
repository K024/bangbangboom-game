import { Geometry, TYPES, AbstractBatchRenderer, Renderer, BatchShaderGenerator, ViewableBuffer, utils, Sprite, Texture, Point, Buffer } from "pixi.js"

// modified from
// https://github.com/pixijs/pixi-projection/

const shaderVert = `
precision highp float;

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec4 aColor;
attribute float aTextureId;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;
varying vec4 vColor;
varying float vTextureId;

void main(void){
    gl_Position.xyw = projectionMatrix * aVertexPosition;
    gl_Position.z = 0.0;

    vTextureCoord = aTextureCoord;
    vTextureId = aTextureId;
    vColor = aColor;
}`
const shaderFrag = `
varying vec2 vTextureCoord;
varying vec4 vColor;
varying float vTextureId;

uniform sampler2D uSamplers[%count%];

void main(void){
    vec4 color;
    %forloop%;
    gl_FragColor = color * vColor;
}`

class Batch2dGeometry extends Geometry {
    _buffer: Buffer
    _indexBuffer: Buffer

    constructor(_static = false) {
        super()

        this._buffer = new Buffer(null!, _static, false)

        this._indexBuffer = new Buffer(null!, _static, true)

        this.addAttribute('aVertexPosition', this._buffer, 3, false, TYPES.FLOAT)
            .addAttribute('aTextureCoord', this._buffer, 2, false, TYPES.FLOAT)
            .addAttribute('aColor', this._buffer, 4, true, TYPES.UNSIGNED_BYTE)
            .addAttribute('aTextureId', this._buffer, 1, true, TYPES.FLOAT)
            .addIndex(this._indexBuffer)
    }
}

class Batch2dPlugin extends AbstractBatchRenderer {
    constructor(renderer: Renderer) {
        super(renderer)

        this.shaderGenerator = new BatchShaderGenerator(shaderVert, shaderFrag)
        this.geometryClass = Batch2dGeometry
        this.vertexSize = 7
    }

    vertexSize: number

    packInterleavedGeometry(element: any, attributeBuffer: ViewableBuffer, indexBuffer: Uint16Array, aIndex: number, iIndex: number) {
        const {
            uint32View,
            float32View,
        } = attributeBuffer

        const packedVertices = aIndex / this.vertexSize
        const uvs = element.uvs
        const indicies = element.indices
        const vertexData = element.vertexData
        const vertexData2d = element.vertexData2d
        const textureId = element._texture.baseTexture._batchLocation

        const alpha = Math.min(element.worldAlpha, 1.0)
        const argb = (alpha < 1.0
            && element._texture.baseTexture.alphaMode)
            ? utils.premultiplyTint(element._tintRGB, alpha)
            : element._tintRGB + (alpha * 255 << 24)

        if (vertexData2d) {
            for (let i = 0, j = 0; i < vertexData2d.length; i += 3, j += 2) {
                float32View[aIndex++] = vertexData2d[i]
                float32View[aIndex++] = vertexData2d[i + 1]
                float32View[aIndex++] = vertexData2d[i + 2]
                float32View[aIndex++] = uvs[j]
                float32View[aIndex++] = uvs[j + 1]
                uint32View[aIndex++] = argb
                float32View[aIndex++] = textureId
            }
        } else {
            for (let i = 0; i < vertexData.length; i += 2) {
                float32View[aIndex++] = vertexData[i]
                float32View[aIndex++] = vertexData[i + 1]
                float32View[aIndex++] = 1.0
                float32View[aIndex++] = uvs[i]
                float32View[aIndex++] = uvs[i + 1]
                uint32View[aIndex++] = argb
                float32View[aIndex++] = textureId
            }
        }

        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < indicies.length; i++) {
            indexBuffer[iIndex++] = packedVertices + indicies[i]
        }
    }
}

Renderer.registerPlugin('mybatch2d', Batch2dPlugin as any)

export class Sprite2d extends Sprite {
    constructor(texture?: Texture) {
        super(texture)
        this.pluginName = 'mybatch2d'
    }

    vertexData2d?: Float32Array

    projection = new Point()
    get projectionX() { return this.projection.x }
    set projectionX(v) { this.projection.x = v }
    get projectionY() { return this.projection.y }
    set projectionY(v) { this.projection.y = v }

    calculateVertices() {
        const texture = this.texture

        const self = this as any
        const wid = (this.transform as any)._worldID
        const tuid = (texture as any)._updateID
        if (self._transformID === wid && self._textureID === tuid) {
            return
        }
        // update texture UV here, because base texture can be changed without calling `_onTextureUpdate`
        if (self._textureID !== tuid) {
            self.uvs = (texture as any)._uvs.uvsFloat32
        }

        self._transformID = wid
        self._textureID = tuid

        const vertexData = self.vertexData
        const trim = texture.trim
        const orig = texture.orig
        const anchor = self._anchor

        let w0 = 0
        let w1 = 0
        let h0 = 0
        let h1 = 0

        if (trim) {
            // if the sprite is trimmed and is not a tilingsprite then we need to add the extra
            // space before transforming the sprite coords.
            w1 = trim.x - (anchor._x * orig.width)
            w0 = w1 + trim.width

            h1 = trim.y - (anchor._y * orig.height)
            h0 = h1 + trim.height
        } else {
            w1 = -anchor._x * orig.width
            w0 = w1 + orig.width

            h1 = -anchor._y * orig.height
            h0 = h1 + orig.height
        }

        if (!this.vertexData2d) {
            this.vertexData2d = new Float32Array(12)
        }
        const vertexData2d = this.vertexData2d
        const px = (this.projectionX || 0) / (w0 - w1)
        const py = (this.projectionY || 0) / (h0 - h1)

        const wt = this.transform.worldTransform
        const a = wt.a
        const b = wt.b
        const c = wt.c
        const d = wt.d
        const tx = wt.tx
        const ty = wt.ty
        // xy
        vertexData2d[2] = w1 * px + h1 * py + 1
        vertexData2d[0] = (a * w1) + (c * h1) + tx * vertexData2d[2]
        vertexData2d[1] = (d * h1) + (b * w1) + ty * vertexData2d[2]
        vertexData[0] = vertexData2d[0] / vertexData2d[2]
        vertexData[1] = vertexData2d[1] / vertexData2d[2]
        // xy
        vertexData2d[5] = w0 * px + h1 * py + 1
        vertexData2d[3] = (a * w0) + (c * h1) + tx * vertexData2d[5]
        vertexData2d[4] = (d * h1) + (b * w0) + ty * vertexData2d[5]
        vertexData[2] = vertexData2d[3] / vertexData2d[5]
        vertexData[3] = vertexData2d[4] / vertexData2d[5]
        // xy
        vertexData2d[8] = w0 * px + h0 * py + 1
        vertexData2d[6] = (a * w0) + (c * h0) + tx * vertexData2d[8]
        vertexData2d[7] = (d * h0) + (b * w0) + ty * vertexData2d[8]
        vertexData[4] = vertexData2d[6] / vertexData2d[8]
        vertexData[5] = vertexData2d[7] / vertexData2d[8]
        // xy
        vertexData2d[11] = w1 * px + h0 * py + 1
        vertexData2d[9] = (a * w1) + (c * h0) + tx * vertexData2d[11]
        vertexData2d[10] = (d * h0) + (b * w1) + ty * vertexData2d[11]
        vertexData[6] = vertexData2d[9] / vertexData2d[11]
        vertexData[7] = vertexData2d[10] / vertexData2d[11]

        if (self._roundPixels) {
            for (let i = 0; i < 8; i++) {
                vertexData[i] = Math.round(vertexData[i])
            }
        }
    }
}

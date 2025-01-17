attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal; //法向量
uniform mat4 u_MvpMatrix;
uniform mat4 u_ModelMatrix; //模型矩阵
uniform mat4 u_NormalMatrix; //用来变换法向量的矩阵
uniform vec3 u_LightColor;//光线颜色
uniform vec3 u_LightPosition;  //光源位置（世界坐标系）
uniform vec3 u_AmbientLight; //环境光颜色
varying vec4 v_Color;
void main() {
    gl_Position = u_MvpMatrix * a_Position;
    vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));   //计算变换后的法向量并归一化
    vec4 vertexPosition = u_ModelMatrix * a_Position; //计算变换后的顶点位置
    vec3 lightDirection = normalize(u_LightPosition - vec3(vertexPosition)); //计算光线方向
    float nDotL = max(dot(lightDirection, normal), 0.0);   //计算光线与法向量的点积
    vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;  //计算漫反射光的颜色
    vec3 ambient = u_AmbientLight * a_Color.rgb; //计算环境光产生的反射光颜色
    v_Color = vec4(diffuse + ambient, a_Color.a);
}
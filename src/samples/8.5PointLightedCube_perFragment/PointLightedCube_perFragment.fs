precision mediump float;

uniform vec3 u_LightColor;
uniform vec3 u_LightPosition;
uniform vec3 u_AmbientLight;
varying vec3 v_Normal;
varying vec3 v_Position;
varying vec4 v_Color;
void main(){
    vec3 normal = normalize(v_Normal);  //对法线进行归一化，因为其内插之后长度不一定是1.0
    vec3 lightDirection = normalize(u_LightPosition - v_Position);  //计算光线方向
    float nDotL = max(dot(lightDirection, normal), 0.0);//计算光线方向与法线的点积，这里的点积是取最大值，因为光线方向与法线方向是朝向一个方向的，所以取最大值
    vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;  //计算漫反射光的颜色
    vec3 ambient = u_AmbientLight * v_Color.rgb;  //计算环境光的颜色
    gl_FragColor = vec4(diffuse + ambient, v_Color.a);
} 